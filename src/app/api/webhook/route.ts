import {
  CallEndedEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
} from "@stream-io/node-sdk";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/inngest/client";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apikey = req.headers.get("x-api-key");

  if (!signature || !apikey) {
    return NextResponse.json(
      { error: "Missing signature or API key" },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  // ✅ عند بدء الجلسة
  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      console.error("Missing meetingId in event");
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    // تأكد من وجود OpenAI API Key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API Key is not configured");
      return NextResponse.json(
        { error: "OpenAI API Key not configured" },
        { status: 500 }
      );
    }

    // ✅ البحث عن الاجتماع
    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );

    if (!existingMeeting) {
      console.error("Meeting not found:", meetingId);
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // ✅ تحديث حالة الاجتماع
    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, existingMeeting.id));

    // ✅ البحث عن الـ Agent
    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      console.error("Agent not found:", existingMeeting.agentId);
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    try {
      console.log("Connecting OpenAI for meeting:", meetingId);
      console.log("Agent ID:", existingAgent.id);

      const call = streamVideo.video.call("default", meetingId);

      // ✅ إنشاء أو جلب المكالمة
      await call.getOrCreate({
        data: {
          created_by_id: existingAgent.id,
          settings_override: {
            audio: {
              mic_default_on: true,
              speaker_default_on: true,
              default_device: "speaker",
            },
          },
        },
      });

      // ✅ توصيل OpenAI (بدون voice هنا)
      const realtimeClient = await streamVideo.video.connectOpenAi({
        call,
        openAiApiKey: process.env.OPENAI_API_KEY!,
        agentUserId: existingAgent.id,
      });

      console.log("✅ OpenAI client connected successfully");

      // ✅ تحديث إعدادات الجلسة
      realtimeClient.updateSession({
        instructions:
          existingAgent.instructions ||
          "You are a helpful AI assistant in a video call.",
        voice: "alloy",
        model: "gpt-4o-realtime-preview-2024-10-01",
        modalities: ["text", "audio"],
        input_audio_transcription: {
          model: "whisper-1",
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
        temperature: 0.8,
        max_response_output_tokens: 4096,
      });

      console.log("Session updated with instructions");

      // ✅ إضافة Event Listeners مع typing صحيح
      realtimeClient.on("error", (error: unknown) => {
        console.error("OpenAI Realtime error:", error);
      });

      realtimeClient.on("conversation.updated", (event: unknown) => {
        console.log("Conversation updated:", event);
      });

      realtimeClient.on("response.done", (event: unknown) => {
        console.log("Response completed:", event);
      });

      realtimeClient.on(
        "input_audio_buffer.speech_started",
        (_event: unknown) => {
          console.log("Speech detected");
        }
      );

      realtimeClient.on(
        "input_audio_buffer.speech_stopped",
        (_event: unknown) => {
          console.log("Speech stopped");
        }
      );
    } catch (error: unknown) {
      console.error("Error connecting OpenAI:", error);
      return NextResponse.json(
        {
          error: "Failed to connect OpenAI",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }

  // ✅ عند مغادرة أحد المشاركين
  else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      console.error("Missing meetingId in participant left event");
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

     const call = streamVideo.video.call("default", meetingId);
        await call.end();
    } else if (eventType === "call.session_ended"){
        const event = payload as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;

        if(!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" },{ status: 400 });
 
        }

        await db
            .update(meetings)
            .set({
                status: "processing",
                endedAt: new Date(),
            })
            .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
    }

  // ✅ عند انتهاء المكالمة فعليًا
 else if (eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        const [updatedMeeting] = await db
            .update(meetings)
            .set({
                transcriptUrl: event.call_transcription.url,
            })
            .where(eq(meetings.id, meetingId))
            .returning();

        if(!updatedMeeting) {
            return NextResponse.json({ error: "Meeting not found" },{ status: 404 });
 
        }
          await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId: updatedMeeting.id,
                transcriptUrl: updatedMeeting.transcriptUrl,
            },
        });
  } 
  else if(eventType === "call.recording_ready"){
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        await db
            .update(meetings)
            .set({
                recordingUrl: event.call_recording.url,
            })
            .where(eq(meetings.id, meetingId));
    }

  return NextResponse.json({ status: "ok" });
}
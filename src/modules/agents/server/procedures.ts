import { z } from "zod";
import {TRPCError} from "@trpc/server"
import { db } from "@/db";
import { and, eq, ilike, getTableColumns, sql, desc, count } from "drizzle-orm";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";

export const agentsRouter = createTRPCRouter({
  update: protectedProcedure
  .input(agentsUpdateSchema)
  .mutation(async({ctx, input })=>{
    const [updateAgent]= await db
    .update(agents)
    .set(input)
    .where(
      and(
        eq(agents.id, input.id),
        eq(agents.userId, ctx.auth.user.id),
      )
    )
    .returning();
    if(!updateAgent){
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Agent not found"
      });
    }
    return updateAgent ;
  }),
  remove: protectedProcedure
  .input((z.object({ id: z.string ()})))
  .mutation(async({ctx, input })=>{
    const [removedAgent] = await db
    .delete(agents)
    .where(
      and(
        eq(agents.id, input.id),
        eq(agents.userId, ctx.auth.user.id),
      ),
    )
    .returning();
    if(!removedAgent){
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Agent not found"
      });
    }

    return removedAgent;

  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input ,ctx}) => {
      const [existingAgent] = await db
        .select({
          meetingCount:sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and 
          (eq(agents.id, input.id),
          eq(agents.userId,ctx.auth.user.id),
        )
      );

      if(!existingAgent){
        throw new TRPCError({code:"NOT_FOUND",message:"Agent not found"});
      }

      return existingAgent;
    }),

  // 🔹 Get Many Agents (with pagination & search)
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(), // ✅ سمول هنا
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize } = input;

      // ✅ جلب البيانات مع pagination وفلترة بالاسم
      const data = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`6`,
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      // ✅ حساب العدد الكلي للصفوف
      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),

  // 🔹 Create New Agent
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdAgent;
    }),
});


import{VideoIcon} from"lucide-react";
import {EmptyState} from "@/components/empty-state";
import {Button} from "@/components/ui/button";
import Link from "next/link";
interface Props {
    meetingId?: string;
 
}

export const ActiveState = ({
    meetingId,
}: Props) =>{
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="Meeting is Active"
        description="Meetind will end once all participants ha"
      />
      <div className="flex flex-col-reverse lg:justify-center items-centrt itmes-center gap-2w-full">
    
        <Button  asChild className="w-full lg:w-auto">
            <Link href={`/call/${meetingId}`} >  
            <VideoIcon />
            Join meeting
            </Link>
        </Button>
      </div>
    </div>
  )
}
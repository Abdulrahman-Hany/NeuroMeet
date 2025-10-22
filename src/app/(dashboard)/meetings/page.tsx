import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/ui/Views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";

const Page =()=>{
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({})
    );


    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingsViewLoading />}>
                <ErrorBoundary fallback={<MeetingsViewError />}>
                   <MeetingsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export  default Page;




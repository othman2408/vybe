import ProjectView from "@/modules/projects/ui/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface props {
  params: Promise<{
    projectId: string;
  }>;
}
export default async function page({ params }: props) {
  const { projectId } = await params;

  const queryClinet = getQueryClient();

  void queryClinet.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  void queryClinet.prefetchQuery(
    trpc.project.getOne.queryOptions({ id: projectId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Suspense fallback={<p>Loading ...</p>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  );
}

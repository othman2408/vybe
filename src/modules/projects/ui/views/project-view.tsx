"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MessageContainer from "../components/message-container";
import { Suspense } from "react";

interface Props {
  projectId: string;
}

export default function ProjectView({ projectId }: Props) {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={10}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>loading messages...</p>}>
            <MessageContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={65} minSize={50}></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

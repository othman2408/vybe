import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import MessageCard from "./message-card";
import MessageForm from "./message-form";

interface MessageContainerProps {
  projectId: string;
}

export default function MessageContainer({ projectId }: MessageContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  // Track if user is near bottom (within 100px)
  const [isNearBottom, setIsNearBottom] = useState(true);

  // Throttle scroll calls
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Scroll handler to update isNearBottom
  const onScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const nearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
    setIsNearBottom(nearBottom);
  };

  useEffect(() => {
    if (!isNearBottom) return; // Don't auto-scroll if user scrolled up

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // throttle delay 100ms

    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [messages, isNearBottom]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 min-h-0 overflow-y-auto"
      >
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={false}
              onFragmentClick={() => {}}
              type={message.type}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
}

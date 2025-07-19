import Image from "next/image";
import { useState, useEffect } from "react";

function ShimmerMessages() {
  const messages = [
    "Thinking...",
    "Analyzing your request...",
    "Processing...",
    "Preparing your response...",
    "Creating your response...",
    "Assembling your response...",
    "Loading your response...",
    "Generating your response...",
  ];

  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMsgIndex]}
      </span>
    </div>
  );
}

export default function MessageLoading() {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="Vybe"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Vybe</span>
      </div>

      <div className="pl-8.5 flex flex-col gap-y-4">
        <ShimmerMessages />
      </div>
    </div>
  );
}

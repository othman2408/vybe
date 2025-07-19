import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma";
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { useState } from "react";
import Hint from "./hint";
import { Input } from "@/components/ui/input";

interface FragmentWebProps {
  data: Fragment;
}

export default function FragmentWeb({ data }: FragmentWebProps) {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragmentKey] = useState(0);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const onCopy = () => {
    if (!data.sandboxURL) return;
    navigator.clipboard.writeText(data.sandboxURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const onOpen = () => {
    if (!data.sandboxURL) return;
    window.open(data.sandboxURL, "_blank");
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        {/* Refresh */}
        <Hint text="Refresh">
          <Button size="icon" variant="ghost" onClick={onRefresh}>
            <RefreshCcwIcon className="size-4" />
          </Button>
        </Hint>

        {/* URL */}
        <Input
          value={data.sandboxURL || "No sandbox URL available"}
          className="flex-1 text-xs font-mono bg-background/50  hover:bg-background/80 transition-colors"
          readOnly
          // onClick={onCopy}
          title="Sandbox URL"
        />
        {/* <Button
          size="sm"
          variant="outline"
          className="flex-1 justify-start text-start"
          disabled={!data.sandboxURL || copied}
          //   onClick={onOpen}
        >
          <span className="text-xs truncate">{data.sandboxURL}</span>
        </Button> */}

        {/* Copy */}
        <Hint text="Copy">
          <Button
            size="icon"
            variant="ghost"
            onClick={onCopy}
            disabled={!data.sandboxURL}
          >
            {copied ? (
              <CheckIcon className="size-4" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </Button>
        </Hint>

        {/* Open in new tab */}
        <Hint text="Open in new tab">
          <Button
            size="icon"
            variant="ghost"
            disabled={!data.sandboxURL}
            onClick={onOpen}
          >
            <ExternalLinkIcon className="size-4" />
          </Button>
        </Hint>
      </div>

      {/* Iframe */}
      <iframe
        key={fragmentKey}
        className="w-full h-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxURL}
      ></iframe>
    </div>
  );
}

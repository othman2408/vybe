import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface UsageProps {
  point: number;
  msBeforeNext: number;
}

export const Usage = ({ point, msBeforeNext }: UsageProps) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  const resetTime = useMemo(() => {
    try {
      return formatDuration(
        intervalToDuration({
          start: new Date(),
          end: new Date(Date.now() + msBeforeNext),
        }),
        { format: ["months", "days", "hours"] }
      );
    } catch (error) {
      console.error(`Error resetting usage: ${error}`);
      return "unknown";
    }
  }, [msBeforeNext]);

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {point} {hasProAccess ? "" : "free"} credits remaining
          </p>
          <p className="text-xs text-muted-foreground">Reset in {resetTime}</p>
        </div>

        {!hasProAccess && (
          <Button asChild size={"sm"} variant={"upgrade"} className="ml-auto">
            <Link href="/pricing">
              <CrownIcon /> Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

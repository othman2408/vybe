"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Vybe"
            width={70}
            height={70}
            className="hidden md:block opacity-60"
          />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-5xl font-bold">
            Something went wrong
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            We encountered an unexpected error. Don&apos;t worry, our team has
            been notified and we&apos;re working to fix it.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => (window.location.href = "/")}
          >
            Go home
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="max-w-2xl mx-auto mt-8">
            <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              Error details (development only)
            </summary>
            <pre className="mt-4 p-4 bg-muted rounded-md text-sm overflow-auto">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </section>
    </div>
  );
}

"use client";
import { SignUp } from "@clerk/nextjs";
import { useCurrentTheme } from "@/hooks/use-current-themen";
import { dark } from "@clerk/themes";

export default function Page() {
  const currentTheme = useCurrentTheme();

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <SignUp
            appearance={{
              baseTheme: currentTheme === "dark" ? dark : undefined,
            }}
          />
        </div>
      </section>
    </div>
  );
}

"use client";
import Image from "next/image";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function PricingPage() {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col  w-full max-w-3xl mx-auto">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Vybe"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
        <p className="text-center text-sm md:text-base text-muted-foreground">
          Choose the plan that&apos;s right for you.
        </p>
        <PricingTable
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
            elements: {
              pricingTableCard: "border! shadow-none! rounded-lg!",
            },
          }}
        />
      </section>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCurrentTheme } from "@/hooks/use-current-themen";
import { dark } from "@clerk/themes";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const currentTheme = useCurrentTheme();
  const isScrolled = useScroll();
  return (
    <nav
      className={cn(
        "px-4 py-3 bg-transparent fixed top-0 right-0 left-0 transition-all duration-200 border-b border-transparent",
        isScrolled && "bg-background/80 backdrop-blur-xs border-border/50"
      )}
    >
      <div className="flex justify-between items-center max-w-5xl mx-auto w-fullm">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Vybe Logo" width={24} height={24} />
          <span className="text-lg font-semibold">Vybe</span>
        </Link>
        <SignedOut>
          <div className="flex gap-2">
            <SignUpButton>
              <Button variant={"outline"} size={"sm"}>
                Sign Up
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size={"sm"}>Sign In</Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton
            showName={true}
            appearance={{
              elements: {
                userButtonBox: "rounded-md!",
                userButtonAvatarBox: "rounded-md! size-8!",
                userButtonTrigger: "rounded-md!",
              },
              baseTheme: currentTheme === "dark" ? dark : undefined,
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
}

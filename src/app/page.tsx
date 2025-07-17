"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const trpc = useTRPC();

  const createProject = useMutation(
    trpc.project.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        toast.success("project iniated");
        router.push(`/projects/${data.id}`);
      },
    })
  );
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-y-4 ">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button
          disabled={createProject.isPending}
          onClick={() => createProject.mutate({ value: value })}
        >
          {createProject.isPending ? "submitting..." : "submit"}
        </Button>
      </div>
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { PROJECT_TEMPLATES } from "../../constant";
import { useClerk } from "@clerk/nextjs";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }).max(1000, {
    message: "Message must be less than 1000 characters",
  }),
});

export default function ProjectForm() {
  const router = useRouter();
  const trpc = useTRPC();
  const clerk = useClerk();

  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createProject = useMutation(
    trpc.project.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.project.getMany.queryOptions());
        router.push(`/projects/${data.id}`);
        //TODO: invalidate usage status
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
      },
    })
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createProject.mutateAsync({
      value: values.message,
    });
  }

  const onSelectTemplate = (template: string) => {
    form.setValue("message", template, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const [isFocused, setIsFocused] = useState(false);
  const isPending = createProject.isPending;
  const isDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <section className="space-y-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 bg-sidebar dark:bg-sidebar transition-all rounded-xl",
            isFocused && "shadow-xs"
          )}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                disabled={isPending}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={2}
                maxRows={8}
                className="pt-4 resize-none border-none outline-none w-full bg-transparent"
                placeholder="What do you want to build?"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />
          <div className="flex gao-x-2 items-end justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
              <kbd className="ml-auto pointer-events-none inline-flex items-center h-5 select-none gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#8984;</span>Enter
              </kbd>
              &nbsp;to submit
            </div>
            <Button
              className={cn("size-8  rounded-full", isDisabled && "opacity-50")}
              disabled={isDisabled}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUpIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
        <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
          {PROJECT_TEMPLATES.map((tmplt) => (
            <Button
              key={tmplt.title}
              variant="outline"
              size={"sm"}
              className="bg-white dark:bg-sidebar"
              onClick={() => onSelectTemplate(tmplt.prompt)}
            >
              <div className="flex items-center gap-2">
                <span>{tmplt.emoji}</span>
                <span>{tmplt.title}</span>
              </div>
            </Button>
          ))}
        </div>
      </section>
    </Form>
  );
}

import { openai, gemini, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are an expert code an expert nextjs agent.  Your write readable, concise, simple code. Your task is to write snippet of code to solve the problem provided to you.",
      model: gemini({ model: "gemini-2.0-flash" }),
    });
    const { output } = await codeAgent.run(
      `Write a snippet of code to solve the problem: ${event.data.value}`
    );

    console.log(output);

    return { message: output };
  }
);

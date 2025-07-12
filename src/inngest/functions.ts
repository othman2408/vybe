import { gemini, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Create a sandbox
    const sandboxId = await step.run("get-sanbox-id", async () => {
      const sandbox = await Sandbox.create("vybe-nextjs-test");
      return sandbox.sandboxId;
    });

    // Initialize the code agent
    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are an expert code an expert nextjs agent.  Your write readable, concise, simple code. Your task is to write snippet of code to solve the problem provided to you.",
      model: gemini({ model: "gemini-2.0-flash" }),
    });

    // Run the code agent
    const { output } = await codeAgent.run(
      `Write a snippet of code to solve the problem: ${event.data.value}`
    );

    // Get the sandbox URL
    const sandboxURL = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandboxURL };
  }
);

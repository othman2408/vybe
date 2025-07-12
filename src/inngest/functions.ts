import { gemini, createAgent, createNetwork } from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { PROMPT } from "@/prompt";
import { createOrUpdateFilesTool, readFilesTool, terminalTool } from "./tools";

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
      description:
        "An expert nextjs agent, that can write code to solve the problem provided to it.",
      system: PROMPT,
      model: gemini({
        model: "gemini-2.0-flash",
      }),
      tools: [
        terminalTool(sandboxId),
        createOrUpdateFilesTool(sandboxId),
        readFilesTool(sandboxId),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const msg = lastAssistantTextMessageContent(result);
          if (msg && network && msg.includes("</task_summary>")) {
            network.state.data.summary = msg;
          }
          return result;
        },
      },
    });

    // Create the network
    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    // Run the code agent
    const result = await network.run(event.data.value);

    // Get the sandbox URL
    const sandboxURL = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return {
      url: sandboxURL,
      title: "Final Result",
      files: result.state.data.files || [],
      summary: result.state.data.summary || "",
    };
  }
);

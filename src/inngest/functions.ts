import { createAgent, createNetwork, openai } from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { PROMPT } from "@/prompt";
import { createOrUpdateFilesTool, readFilesTool, terminalTool } from "./tools";
import { prisma } from "@/lib/db";
import { AgentState } from "@/lib/types";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    // Create a sandbox
    const sandboxId = await step.run("get-sanbox-id", async () => {
      const sandbox = await Sandbox.create("vybe-nextjs-test");
      return sandbox.sandboxId;
    });

    // Initialize the code agent
    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description:
        "An expert nextjs agent, that can write code to solve the problem provided to it.",
      system: PROMPT,
      model: openai({
        baseUrl: "https://api.deepseek.com",
        model: "deepseek-chat",
        defaultParameters: {
          temperature: 0.1,
        },
        apiKey: process.env.DEEPSEEK_API_KEY,
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
    const network = createNetwork<AgentState>({
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

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    // Get the sandbox URL
    const sandboxURL = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    // Save the result to the database
    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            content: result.state.data.summary,
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return await prisma.message.create({
        data: {
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxURL: sandboxURL,
              title: "Fragment",
              files: result.state.data.files || [],
            },
          },
        },
      });
    });

    return {
      url: sandboxURL,
      title: "Final Result",
      files: result.state.data.files || [],
      summary: result.state.data.summary || "",
    };
  }
);

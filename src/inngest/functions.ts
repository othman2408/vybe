import {
  createAgent,
  createNetwork,
  createState,
  openai,
  type Message,
} from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
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

    // Memory for the code agent
    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];

        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }
        return formattedMessages;
      }
    );

    // State for the code agent (memory)
    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    // Initialize the code agent
    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description:
        "An expert nextjs agent, that can write code to solve the problem provided to it.",
      system: PROMPT,
      model: openai({
        baseUrl: "https://api.deepseek.com",
        // baseUrl: "https://api.groq.com/openai/v1",
        // baseUrl: "https://api.fireworks.ai/inference/v1",
        // baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
        // baseUrl: "https://integrate.api.nvidia.com/v1",
        // baseUrl: "https://openrouter.ai/api/v1",
        model: "deepseek-chat",
        defaultParameters: {
          temperature: 0.1,
        },
        apiKey: process.env.DEEPSEEK_API_KEY,
        // apiKey: process.env.GROQ_API_KEY,
        // apiKey: process.env.FIREWORKS_API_KEY,
        // apiKey: process.env.GEMINI_API_KEY,
        // apiKey: process.env.NVIDIA_API_KEY,
        // apiKey: process.env.OPENROUTER_API_KEY,
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
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    // Run the code agent
    const result = await network.run(event.data.value, { state });

    // Agent for generating a title for a code fragment
    const fragmentTitleGenerator = createAgent<AgentState>({
      name: "fragment-title-generator",
      description: "A agent that generates a title for a code fragment.",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        baseUrl: "https://api.deepseek.com",
        model: "deepseek-chat",
        apiKey: process.env.DEEPSEEK_API_KEY,
        defaultParameters: {
          temperature: 0.1,
        },
      }),
    });

    // Agent for generating a response for the user
    const responseGenerator = createAgent<AgentState>({
      name: "response-generator",
      description: "A agent that generates a response for the user.",
      system: RESPONSE_PROMPT,
      model: openai({
        baseUrl: "https://api.deepseek.com",
        model: "deepseek-chat",
        apiKey: process.env.DEEPSEEK_API_KEY,
        defaultParameters: {
          temperature: 0.1,
        },
      }),
    });

    // Run the agents
    const [fragmentTitleResult, responseResult] = await Promise.all([
      fragmentTitleGenerator.run(result.state.data.summary),
      responseGenerator.run(result.state.data.summary),
    ]);

    const extractTextContent = (
      output: Message[],
      fallback: string
    ): string => {
      if (output[0].type !== "text") return fallback;

      if (Array.isArray(output[0].content)) {
        return output[0].content.map((c) => c.text).join("");
      }

      return output[0].content;
    };

    const fragmentTitle = extractTextContent(
      fragmentTitleResult.output,
      "Fragment"
    );
    const response = extractTextContent(
      responseResult.output,
      "I'm sorry, I couldn't generate a response."
    );

    // Check if the result is an error
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
            projectId: event.data.projectId,
            content: result.state.data.summary,
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: response,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxURL: sandboxURL,
              title: fragmentTitle,
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

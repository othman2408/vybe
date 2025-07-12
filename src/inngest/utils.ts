import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(id: string) {
  const sandbox = await Sandbox.connect(id);
  return sandbox;
}

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIdx = result.output.findIndex(
    (message) => message.role === "assistant"
  );

  const message = result.output[lastAssistantTextMessageIdx] as
    | TextMessage
    | undefined;

  if (!message?.content) {
    return undefined;
  }
  if (typeof message.content === "string") {
    return message.content;
  } else {
    return message.content.map((part) => part.text).join("");
  }
}

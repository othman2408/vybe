import { Sandbox } from "@e2b/code-interpreter";

export async function getSandbox(id: string) {
  const sandbox = await Sandbox.connect(id);
  return sandbox;
}

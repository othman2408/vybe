import { z } from "zod";
import { getSandbox } from "./utils";
import { createTool, type Tool } from "@inngest/agent-kit";
import { AgentState } from "@/lib/types";

export function terminalTool(sandboxId: string) {
  return createTool({
    name: "terminal",
    description: "Use this tool to run terminal commands",
    parameters: z.object({
      command: z.string(),
    }),
    handler: async ({ command }, { step }) => {
      return await step?.run("terminal", async () => {
        const buffer = { stdout: "", stderr: "" };

        try {
          const sandbox = await getSandbox(sandboxId);
          const result = await sandbox.commands.run(command, {
            onStdout(data: string) {
              buffer.stdout += data;
            },
            onStderr(data: string) {
              buffer.stderr += data;
            },
          });

          return result.stdout;
        } catch (error) {
          console.error(
            `Command failed (${command}) : Error: ${error} \n stdout: ${buffer.stdout} \n stderr: ${buffer.stderr}`
          );
          return `Command failed (${command}) : Error: ${error} \n stdout: ${buffer.stdout} \n stderr: ${buffer.stderr}`;
        }
      });
    },
  });
}

export function createOrUpdateFilesTool(sandboxId: string) {
  return createTool({
    name: "createOrUpdateFiles",
    description: "Use this tool to read and write files in the sandbox",
    parameters: z.object({
      files: z.array(
        z.object({
          path: z.string(),
          content: z.string(),
        })
      ),
    }),
    handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
      const newFiles = await step?.run("createOrUpdateFiles", async () => {
        try {
          const updatedFiles = (await network.state.data.files) || {};
          const sandbox = await getSandbox(sandboxId);
          for (const file of files) {
            await sandbox.files.write(file.path, file.content);
            updatedFiles[file.path] = file.content;
          }

          return updatedFiles;
        } catch (error) {
          console.error(`Failed to update files: ${error}`);
          return `Failed to update files: ${error}`;
        }
      });

      if (typeof newFiles === "object") {
        network.state.data.files = newFiles;
      }
    },
  });
}

export function readFilesTool(sandboxId: string) {
  return createTool({
    name: "readFiles",
    description: "Use this tool to read files in the sandbox",
    parameters: z.object({
      files: z.array(z.string()),
    }),
    handler: async ({ files }, { step }) => {
      return await step?.run("readFiles", async () => {
        try {
          const sandbox = await getSandbox(sandboxId);
          const contents = [];

          for (const file of files) {
            const content = await sandbox.files.read(file);
            contents.push({ path: file, content });
          }

          return JSON.stringify(contents);
        } catch (error) {
          console.error(`Failed to read files: ${error}`);
          return `Failed to read files: ${error}`;
        }
      });
    },
  });
}

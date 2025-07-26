import { projectRouter } from "@/modules/projects/server/procedures";
import { createTRPCRouter } from "../init";
import { messageRouter } from "@/modules/messages/server/procedures";
import { usageRouter } from "@/modules/usage/server/procedures";

// Routers
export const appRouter = createTRPCRouter({
  messages: messageRouter,
  project: projectRouter,
  usage: usageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

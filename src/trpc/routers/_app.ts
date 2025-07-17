import { projectRouter } from "@/modules/projects/server/procedures";
import { createTRPCRouter } from "../init";
import { messageRouter } from "@/modules/messages/server/procedures";

// Routers
export const appRouter = createTRPCRouter({
  messages: messageRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

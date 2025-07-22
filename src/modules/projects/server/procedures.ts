import z from "zod";
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  // Get a specific project
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "id is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          userId: ctx.auth.userId,
          id: input.id,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "project not found",
        });
      }

      return existingProject;
    }),

  // Get all projects
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return projects;
  }),

  // Create new project
  create: protectedProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "value is required" }).max(10000, {
          message: "value is too long, maximum length is 10000",
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});

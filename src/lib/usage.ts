import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Duration of the usage
const DURATION = 30 * 24 * 60 * 60;

// Free plan
const FREE_PLAN_POINTS = 2;
const GENERATE_COST = 1;

// Pro plan
const PRO_PLAN_POINTS = 100;

export async function getUsageTracker() {
  const { has } = await auth();
  const hasProAccess = has({ plan: "pro" });

  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "usage",
    points: hasProAccess ? PRO_PLAN_POINTS : FREE_PLAN_POINTS,
    duration: DURATION,
  });

  return usageTracker;
}

export async function consumeCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const usageTracker = await getUsageTracker();

    const result = await usageTracker.consume(userId, GENERATE_COST);

    return result;
  } catch (error) {
    console.error("Error consuming credits:", error);
    throw error;
  }
}

export async function getUsageStatus() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const usageTracker = await getUsageTracker();
    const result = await usageTracker.get(userId);

    return result;
  } catch (error) {
    console.error("Error getting usage status:", error);
    return null;
  }
}

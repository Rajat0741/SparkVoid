import { db } from "@/lib/db";
import { userUsage } from "../schema/user-usage";
import { eq, sql } from "drizzle-orm";

export async function getUsageByUserId(userId: string) {
  const [row] = await db.select().from(userUsage).where(eq(userUsage.userId, userId));
  return row;
}

export async function insertUsageIfNotExists(userId: string) {
  const [row] = await db
    .insert(userUsage)
    .values({ userId, tokensUsed: 0 })
    .onConflictDoNothing()
    .returning();
  return row;
}

export async function recordAndGetUsage(userId: string, tokenCount: number) {
  const [row] = await db
    .insert(userUsage)
    .values({ userId, tokensUsed: tokenCount })
    .onConflictDoUpdate({
      target: userUsage.userId,
      set: {
        tokensUsed: sql`CASE 
          WHEN (user_usage.updated_at AT TIME ZONE 'Asia/Kolkata')::date < (now() AT TIME ZONE 'Asia/Kolkata')::date 
          THEN EXCLUDED.tokens_used 
          ELSE user_usage.tokens_used + EXCLUDED.tokens_used
        END`,
        updatedAt: sql`now()`,
      },
    })
    .returning();
  return row;
}

export async function getUserUsage(userId: string) {
  const [result] = await db
    .select()
    .from(userUsage)
    .where(eq(userUsage.userId, userId));
  return result ?? null;
}

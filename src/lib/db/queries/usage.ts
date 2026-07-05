import { db } from "@/lib/db";
import { userUsage } from "../schema/user-usage";
import { eq, sql } from "drizzle-orm";

export async function recordAndGetUsage(userId: string, tokenCount: number = 0) {
  const [result] = await db
    .insert(userUsage)
    .values({
      userId,
      tokensUsed: tokenCount,
      dailyCap: 100000,
    })
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

  return result;
}

export async function getUserUsage(userId: string) {
  const [result] = await db
    .select()
    .from(userUsage)
    .where(eq(userUsage.userId, userId));
  return result ?? null;
}

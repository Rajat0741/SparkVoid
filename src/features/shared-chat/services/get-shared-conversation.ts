import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";
import { AppError } from "@/utils/app-error";
import { and, eq } from "drizzle-orm";
import type { ConversationType } from "@/lib/db/schema";

/**
 * Fetches a conversation only if it has been explicitly shared.
 * Returns null for private conversations — never exposes them publicly.
 */
export const getSharedConversation = async (
  conversationId: string
): Promise<ConversationType | null> => {
  try {
    const result = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.isShared, true)
        )
      );

    return result[0] ?? null;
  } catch (error) {
    console.error("Failed to get shared conversation:", error);
    throw new AppError("Failed to get shared conversation", 500);
  }
};

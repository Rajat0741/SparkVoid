import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export const deleteConversation = async (
  conversationId: string,
  userId: string,
) => {
  try {
    await db
      .delete(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.userId, userId),
        ),
      );
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    throw new Error("Failed to delete conversation");
  }
};

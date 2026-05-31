import { db } from "@/lib/db";
import { conversations, ConversationType } from "@/lib/db/schema";
import { AppError } from "@/utils/app-error";
import { desc, eq } from "drizzle-orm";

export const getConversations = async (userId: string) => {
  try {
    const retrievedConversations: ConversationType[] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.createdAt));

    return retrievedConversations;
  } catch (error) {
    console.error("Failed to get conversations:", error);
    throw new AppError("Failed to get conversations", 500);
  }
};

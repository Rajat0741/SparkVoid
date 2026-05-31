import { db } from "@/lib/db";
import { conversations, ConversationType } from "@/lib/db/schema";
import { AppError } from "@/utils/app-error";
import { eq } from "drizzle-orm";

export const getConversation = async (conversationId: string): Promise<ConversationType | null> => {
  try {
    const result = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    return result[0] || null;
  } catch (error) {
    console.error("Failed to get conversation:", error);
    throw new AppError("Failed to get conversation", 500);
  }
};

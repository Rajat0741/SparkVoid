import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";
import { AppError } from "@/utils/app-error";
import { eq } from "drizzle-orm";

export const deleteConversation = async (
  conversationId: string,
) => {
  try {
    await db
      .delete(conversations)
      .where(eq(conversations.id, conversationId));
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    throw new AppError("Failed to delete conversation", 500);
  }
};

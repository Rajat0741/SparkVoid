import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const renameConversation = async (
  conversationId: string,
  title: string,
) => {
  try {
    await db
      .update(conversations)
      .set({ title })
      .where(eq(conversations.id, conversationId));
  } catch (error) {
    console.error("Failed to rename conversation:", error);
    throw new Error("Failed to rename conversation");
  }
};

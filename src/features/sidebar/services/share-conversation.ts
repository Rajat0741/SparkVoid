import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const shareConversation = async (
  conversationId: string,
  isShared: boolean,
) => {
  try {
    await db
      .update(conversations)
      .set({ isShared })
      .where(eq(conversations.id, conversationId));
  } catch (error) {
    console.error("Failed to share conversation:", error);
    throw new Error("Failed to share conversation");
  }
};

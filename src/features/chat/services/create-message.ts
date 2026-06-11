import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema/conversations";
import { messages, NewMessageType } from "@/lib/db/schema/messages";
import { AppError } from "@/utils/app-error";
import { CustomUIMessage } from "@/types";
import { eq } from "drizzle-orm";

export const createMessage = async ({
  message,
  conversationId,
}: {
  message: CustomUIMessage;
  conversationId: string;
}): Promise<NewMessageType> => {
  try {
    const [result] = await db
      .insert(messages)
      .values({
        id: message.id,
        conversationId,
        role: message.role,
        metadata: message.metadata,
        parts: message.parts,
      })
      .returning();

    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return result;
  } catch (error) {
    console.error("Failed to create message:", error);
    throw new AppError("Failed to create message", 500);
  }
};

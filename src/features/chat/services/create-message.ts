import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema/conversations";
import { messages, NewMessageType } from "@/lib/db/schema/messages";
import { CustomUIMessage } from "@/types";
import { eq } from "drizzle-orm";

export const createMessage = async ({
  message,
  conversationId,
}: {
  message: CustomUIMessage;
  conversationId: string;
}): Promise<NewMessageType> => {
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
};

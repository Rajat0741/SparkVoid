import { db } from "@/lib/db";
import { messages, MessageType, NewMessageType } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export async function insertMessage(
  data: Omit<NewMessageType, "createdAt">,
): Promise<NewMessageType> {
  const [result] = await db.insert(messages).values(data).returning();
  return result;
}

export async function insertMessageBatch(
  data: Array<Omit<NewMessageType, never>>,
): Promise<void> {
  if (data.length === 0) return;
  await db.insert(messages).values(data);
}

export async function findMessagesByConversationId(
  conversationId: string,
): Promise<MessageType[]> {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));
}

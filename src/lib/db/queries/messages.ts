import { db } from "@/lib/db";
import { messages, MessageType, NewMessageType } from "@/lib/db/schema";
import { and, asc, eq, inArray } from "drizzle-orm";

export async function insertMessage(
  data: Omit<NewMessageType, "createdAt">,
): Promise<NewMessageType> {
  const [result] = await db
    .insert(messages)
    .values(data)
    .onConflictDoUpdate({
      target: messages.id,
      set: {
        parts: data.parts,
        metadata: data.metadata ?? null,
      },
    })
    .returning();
  return result ?? data;
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

export async function deleteMessagesByIds(
  conversationId: string,
  messageIds: string[],
): Promise<void> {
  if (messageIds.length === 0) return;
  await db
    .delete(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        inArray(messages.id, messageIds),
      ),
    );
}

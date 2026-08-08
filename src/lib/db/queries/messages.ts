import { db, type TransactionScope } from "@/lib/db";
import { messages, MessageType, NewMessageType } from "@/lib/db/schema";
import { and, asc, eq, inArray } from "drizzle-orm";

export async function insertMessage(
  data: Omit<NewMessageType, "createdAt">,
  executor: TransactionScope = db,
): Promise<NewMessageType> {
  const [result] = await executor
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
  executor: TransactionScope = db,
): Promise<void> {
  if (data.length === 0) return;
  await executor.insert(messages).values(data);
}

export async function findMessagesByConversationId(
  conversationId: string,
  executor: TransactionScope = db,
): Promise<MessageType[]> {
  return executor
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));
}

export async function deleteMessagesByIds(
  conversationId: string,
  messageIds: string[],
  executor: TransactionScope = db,
): Promise<void> {
  if (messageIds.length === 0) return;
  await executor
    .delete(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        inArray(messages.id, messageIds),
      ),
    );
}

import { db, type TransactionScope } from "@/lib/db";
import {
  conversations,
  ConversationType,
  NewConversationType,
} from "@/lib/db/schema";
import { and, desc, eq, ilike, lt } from "drizzle-orm";

export async function insertConversation(
  data: NewConversationType,
  executor: TransactionScope = db,
): Promise<ConversationType | null> {
  const [result] = await executor
    .insert(conversations)
    .values({ id: data.id, userId: data.userId, title: data.title })
    .onConflictDoNothing()
    .returning();
  return result ?? null;
}

export async function findConversationById(
  conversationId: string,
  executor: TransactionScope = db,
): Promise<ConversationType | null> {
  const [result] = await executor
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId));
  return result ?? null;
}

export async function findSharedConversation(
  conversationId: string,
  executor: TransactionScope = db,
): Promise<ConversationType | null> {
  const [result] = await executor
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.isShared, true),
      ),
    );
  return result ?? null;
}

export async function findConversationsByUserId(
  userId: string,
  limit: number,
  cursor?: Date,
  search?: string,
  executor: TransactionScope = db,
): Promise<ConversationType[]> {
  return executor
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.userId, userId),
        search ? ilike(conversations.title, `%${search}%`) : undefined,
        cursor ? lt(conversations.updatedAt, cursor) : undefined,
      ),
    )
    .orderBy(desc(conversations.isPinned), desc(conversations.updatedAt))
    .limit(limit);
}

export async function updateConversationTitle(
  conversationId: string,
  title: string,
  executor: TransactionScope = db,
): Promise<void> {
  await executor
    .update(conversations)
    .set({ title, updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));
}

export async function updateConversationShared(
  conversationId: string,
  isShared: boolean,
  executor: TransactionScope = db,
): Promise<void> {
  await executor
    .update(conversations)
    .set({ isShared })
    .where(eq(conversations.id, conversationId));
}

export async function updateConversationTimestamp(
  conversationId: string,
  executor: TransactionScope = db,
): Promise<void> {
  await executor
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));
}

export async function updateConversationPinned(
  conversationId: string,
  isPinned: boolean,
  executor: TransactionScope = db,
): Promise<void> {
  await executor
    .update(conversations)
    .set({ isPinned })
    .where(eq(conversations.id, conversationId));
}

export async function deleteConversationById(
  conversationId: string,
  executor: TransactionScope = db,
): Promise<void> {
  await executor
    .delete(conversations)
    .where(eq(conversations.id, conversationId));
}

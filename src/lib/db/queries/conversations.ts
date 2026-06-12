import { db } from "@/lib/db";
import { conversations, ConversationType, NewConversationType } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function insertConversation(
  data: NewConversationType,
): Promise<ConversationType | null> {
  const [result] = await db
    .insert(conversations)
    .values({ id: data.id, userId: data.userId, title: data.title })
    .onConflictDoNothing()
    .returning();
  return result ?? null;
}

export async function findConversationById(
  conversationId: string,
): Promise<ConversationType | null> {
  const [result] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId));
  return result ?? null;
}

export async function findSharedConversation(
  conversationId: string,
): Promise<ConversationType | null> {
  const [result] = await db
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
): Promise<ConversationType[]> {
  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function updateConversationTitle(
  conversationId: string,
  title: string,
): Promise<void> {
  await db
    .update(conversations)
    .set({ title })
    .where(eq(conversations.id, conversationId));
}

export async function updateConversationShared(
  conversationId: string,
  isShared: boolean,
): Promise<void> {
  await db
    .update(conversations)
    .set({ isShared })
    .where(eq(conversations.id, conversationId));
}

export async function updateConversationTimestamp(
  conversationId: string,
): Promise<void> {
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));
}

export async function deleteConversationById(conversationId: string): Promise<void> {
  await db.delete(conversations).where(eq(conversations.id, conversationId));
}

import { generateId } from "ai";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/db/schema";
import { AppError } from "@/utils/app-error";
import { asc, eq } from "drizzle-orm";

/**
 * Duplicates a shared conversation and all its messages into the target user's
 * account within a single transaction. The clone is private by default.
 *
 * @returns The new conversation ID to redirect to.
 */
export const importConversation = async (
  sourceConversationId: string,
  sourceTitle: string,
  userId: string
): Promise<string> => {
  const newConversationId = generateId();
  let conversationInserted = false;

  try {
    // 1. Create the new conversation owned by the importing user
    await db.insert(conversations).values({
      id: newConversationId,
      userId,
      title: sourceTitle,
      isShared: false,
    });
    conversationInserted = true;

    // 2. Fetch all source messages in chronological order
    const sourceMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, sourceConversationId))
      .orderBy(asc(messages.createdAt));

    if (sourceMessages.length > 0) {
      // 3. Bulk-insert cloned messages with new IDs, preserving order and content
      await db.insert(messages).values(
        sourceMessages.map((msg) => ({
          id: generateId(),
          conversationId: newConversationId,
          role: msg.role,
          parts: msg.parts,
          metadata: msg.metadata,
          createdAt: msg.createdAt,
        }))
      );
    }
  } catch (error) {
    console.error("Failed to import conversation:", error);

    // Clean up if conversation was inserted but message copying failed
    if (conversationInserted) {
      try {
        await db.delete(conversations).where(eq(conversations.id, newConversationId));
      } catch (cleanupError) {
        console.error("Failed to clean up conversation during import failure:", cleanupError);
      }
    }

    throw new AppError("Failed to import conversation", 500);
  }

  return newConversationId;
};

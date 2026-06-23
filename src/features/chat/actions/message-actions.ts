"use server";

import { authActionClient } from "@/lib/safe-action";
import { findConversationById, deleteMessagesByIds } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { attachments } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { imagekit } from "@/lib/imagekit";
import { AppError } from "@/utils/app-error";
import z from "zod";

const deleteMessagesSchema = z.object({
  conversationId: z.string(),
  messageIds: z.array(z.string()),
});

export const deleteMessagesAction = authActionClient
  .inputSchema(deleteMessagesSchema)
  .action(async ({ parsedInput: { conversationId, messageIds }, ctx }) => {
    // 1. Verify conversation exists and belongs to the user
    const conversation = await findConversationById(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    if (conversation.userId !== ctx.user.id) {
      throw new AppError("Unauthorized", 403);
    }

    if (messageIds.length === 0) {
      return { success: true };
    }

    // 2. Fetch attachments associated with these messages
    const relatedAttachments = await db
      .select()
      .from(attachments)
      .where(
        and(
          eq(attachments.conversationId, conversationId),
          inArray(attachments.messageId, messageIds),
        ),
      );

    // 3. Delete from ImageKit
    for (const att of relatedAttachments) {
      try {
        await imagekit.files.delete(att.imagekitFileId);
      } catch (error) {
        console.error(`Failed to delete ImageKit attachment ${att.id}:`, error);
      }
    }

    // 4. Delete the messages (attachments in DB will cascade delete)
    await deleteMessagesByIds(conversationId, messageIds);

    return { success: true };
  });

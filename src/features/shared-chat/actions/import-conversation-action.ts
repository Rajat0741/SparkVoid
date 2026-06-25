"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  findSharedConversation,
  findMessagesByConversationId,
  insertConversation,
  insertMessageBatch,
  deleteConversationById,
  findAttachmentsByConversationId,
  insertAttachmentBatch,
} from "@/lib/db/queries";
import { AppError } from "@/utils/app-error";
import { generateId } from "ai";
import { z } from "zod";

const importConversationSchema = z.object({
  conversationId: z.string(),
});

export const importConversationAction = authActionClient
  .inputSchema(importConversationSchema)
  .action(async ({ parsedInput: { conversationId }, ctx }) => {
    const conversation = await findSharedConversation(conversationId);

    if (!conversation) {
      throw new AppError("Shared conversation not found", 404);
    }

    const newConversationId = generateId();

    // Step 1: create the new conversation owned by the importing user
    await insertConversation({
      id: newConversationId,
      userId: ctx.user.id,
      title: conversation.title,
      isShared: false,
    });

    try {
      const [sourceMessages, sourceAttachments] = await Promise.all([
        findMessagesByConversationId(conversationId),
        findAttachmentsByConversationId(conversationId),
      ]);

      const messageIdMap = new Map<string, string>();
      
      const clonedMessages = sourceMessages.map((msg) => {
        const newMsgId = generateId();
        messageIdMap.set(msg.id, newMsgId);
        return {
          id:             newMsgId,
          conversationId: newConversationId,
          role:           msg.role,
          parts:          msg.parts,
          metadata:       msg.metadata,
          createdAt:      msg.createdAt,
        };
      });

      await insertMessageBatch(clonedMessages);

      if (sourceAttachments.length > 0) {
        const clonedAttachments = sourceAttachments.map((att) => ({
          id:             generateId(),
          conversationId: newConversationId,
          messageId:      att.messageId ? (messageIdMap.get(att.messageId) ?? null) : null,
          userId:         ctx.user.id,
          status:         att.status,
          fileName:       att.fileName,
          fileType:       att.fileType,
          fileSize:       att.fileSize,
          imagekitFileId: att.imagekitFileId,
          url:            att.url,
          thumbnailUrl:   att.thumbnailUrl,
          createdAt:      att.createdAt,
        }));
        await insertAttachmentBatch(clonedAttachments);
      }
    } catch (error) {
      console.error("Failed to copy messages/attachments during import — rolling back conversation:", error);
      await deleteConversationById(newConversationId);
      throw new AppError("Failed to import conversation", 500);
    }

    return { newConversationId };
  });

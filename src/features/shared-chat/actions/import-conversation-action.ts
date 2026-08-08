"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  findSharedConversation,
  findMessagesByConversationId,
  findAttachmentsByConversationId,
  insertConversation,
  insertMessageBatch,
  insertAttachmentBatch,
} from "@/lib/db/queries";
import { db } from "@/lib/db";
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

    const [sourceMessages, sourceAttachments] = await Promise.all([
      findMessagesByConversationId(conversationId),
      findAttachmentsByConversationId(conversationId),
    ]);

    const messageIdMap = new Map<string, string>();

    const clonedMessages = sourceMessages.map((msg) => {
      const newMsgId = generateId();
      messageIdMap.set(msg.id, newMsgId);
      return {
        id: newMsgId,
        conversationId: newConversationId,
        role: msg.role,
        parts: msg.parts,
        metadata: msg.metadata,
        createdAt: msg.createdAt,
      };
    });

    const clonedAttachments = sourceAttachments.map((att) => ({
      id: generateId(),
      conversationId: newConversationId,
      messageId: att.messageId
        ? (messageIdMap.get(att.messageId) ?? null)
        : null,
      userId: ctx.user.id,
      status: att.status,
      fileName: att.fileName,
      fileType: att.fileType,
      fileSize: att.fileSize,
      imagekitFileId: att.imagekitFileId,
      url: att.url,
      thumbnailUrl: att.thumbnailUrl,
      createdAt: att.createdAt,
    }));

    await db.transaction(async (tx) => {
      await insertConversation(
        {
          id: newConversationId,
          userId: ctx.user.id,
          title: conversation.title,
        },
        tx,
      );
      await insertMessageBatch(clonedMessages, tx);
      if (clonedAttachments.length > 0) {
        await insertAttachmentBatch(clonedAttachments, tx);
      }
    });

    return { newConversationId };
  });

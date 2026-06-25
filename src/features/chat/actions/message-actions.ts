"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  findConversationById,
  deleteMessagesByIds,
  findAttachmentsByMessageIds,
} from "@/lib/db/queries";
import { AppError } from "@/utils/app-error";
import { deleteUnreferencedAttachments } from "@/lib/imagekit";
import z from "zod";

const deleteMessagesSchema = z.object({
  conversationId: z.string(),
  messageIds: z.array(z.string()),
});

export const deleteMessagesAction = authActionClient
  .inputSchema(deleteMessagesSchema)
  .action(async ({ parsedInput: { conversationId, messageIds }, ctx }) => {

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

    const relatedAttachments = await findAttachmentsByMessageIds(conversationId, messageIds);

    if (relatedAttachments.length > 0) {
      const excludedAttachmentIds = relatedAttachments.map((a) => a.id);
      await deleteUnreferencedAttachments(relatedAttachments, excludedAttachmentIds);
    }

    await deleteMessagesByIds(conversationId, messageIds);

    return { success: true };
  });

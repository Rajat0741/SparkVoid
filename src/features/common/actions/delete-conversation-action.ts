"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  findConversationById,
  deleteConversationById,
  findAttachmentsByConversationId,
} from "@/lib/db/queries";
import { AppError } from "@/utils/app-error";
import { deleteUnreferencedAttachments } from "@/lib/imagekit";
import z from "zod";

const deleteConversationSchema = z.object({
  conversationId: z.string(),
});

export const deleteConversationAction = authActionClient
  .inputSchema(deleteConversationSchema)
  .action(async ({ parsedInput: { conversationId }, ctx }) => {
    const conversation = await findConversationById(conversationId);

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    if (conversation.userId !== ctx.user.id) {
      throw new AppError("Unauthorized to delete this conversation", 403);
    }

    const conversationAttachments = await findAttachmentsByConversationId(conversationId);

    if (conversationAttachments.length > 0) {
      const excludedAttachmentIds = conversationAttachments.map((a) => a.id);
      await deleteUnreferencedAttachments(conversationAttachments, excludedAttachmentIds);
    }

    await deleteConversationById(conversationId);
    return { success: true };
  });

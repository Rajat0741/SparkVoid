"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  findConversationById,
  deleteConversationById,
  findAttachmentFileIdsByConversationId,
} from "@/lib/db/queries";
import { AppError } from "@/utils/app-error";
import { imagekit } from "@/lib/imagekit";
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

    const conversationAttachments =
      await findAttachmentFileIdsByConversationId(conversationId);

    if (conversationAttachments.length > 0) {
      await Promise.all(
        conversationAttachments.map(async (a) => {
          try {
            await imagekit.files.delete(a.imagekitFileId);
          } catch (error) {
            const isNotFound =
              error &&
              typeof error === "object" &&
              ("status" in error ? error.status === 404 : false);

            if (!isNotFound) {
              console.error(
                `Failed to delete file ${a.imagekitFileId} from ImageKit:`,
                error,
              );
            }
          }
        }),
      );
    }

    await deleteConversationById(conversationId);
    return { success: true };
  });

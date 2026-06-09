"use server";

import { authActionClient } from "@/lib/safe-action";
import { deleteConversation } from "../services/delete-conversation";
import { getConversation } from "@/features/common/services/get-conversation";
import { AppError } from "@/utils/app-error";
import z from "zod";
import { db } from "@/lib/db";
import { attachments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { imagekit } from "@/lib/imagekit";

const deleteConversationSchema = z.object({
  conversationId: z.string(),
});

export const deleteConversationAction = authActionClient
  .inputSchema(deleteConversationSchema)
  .action(async ({ parsedInput: { conversationId }, ctx }) => {
    const conversation = await getConversation(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    if (conversation.userId !== ctx.user.id) {
      throw new AppError("Unauthorized to delete this conversation", 403);
    }

    // Fetch and delete ImageKit files before deleting the conversation record
    const conversationAttachments = await db
      .select({ imagekitFileId: attachments.imagekitFileId })
      .from(attachments)
      .where(eq(attachments.conversationId, conversationId));

    if (conversationAttachments.length > 0) {
      const deletePromises = conversationAttachments.map(async (a) => {
        try {
          await imagekit.files.delete(a.imagekitFileId);
        } catch (error) {
          // A 404 from ImageKit is fine — the file may already be gone
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
      });
      await Promise.all(deletePromises);
    }

    await deleteConversation(conversationId);
    return { success: true };
  });

"use server";

import { authActionClient } from "@/lib/safe-action";
import { findConversationById, updateConversationShared } from "@/lib/db/queries";
import { AppError } from "@/utils/app-error";
import z from "zod";

const shareConversationSchema = z.object({
  conversationId: z.string(),
  isShared: z.boolean(),
});

export const shareConversationAction = authActionClient
  .inputSchema(shareConversationSchema)
  .action(async ({ parsedInput: { conversationId, isShared }, ctx }) => {
    const conversation = await findConversationById(conversationId);

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    if (conversation.userId !== ctx.user.id) {
      throw new AppError("Unauthorized to share this conversation", 403);
    }

    await updateConversationShared(conversationId, isShared);
    return { success: true };
  });

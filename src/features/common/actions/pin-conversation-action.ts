"use server";

import { authActionClient } from "@/lib/safe-action";
import { findConversationById, updateConversationPinned } from "@/lib/db/queries";
import { AppError } from "@/utils/app-error";
import z from "zod";

const pinConversationSchema = z.object({
  conversationId: z.string(),
  isPinned: z.boolean(),
});

export const pinConversationAction = authActionClient
  .inputSchema(pinConversationSchema)
  .action(async ({ parsedInput: { conversationId, isPinned }, ctx }) => {
    const conversation = await findConversationById(conversationId);

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    if (conversation.userId !== ctx.user.id) {
      throw new AppError("Unauthorized to pin this conversation", 403);
    }

    await updateConversationPinned(conversationId, isPinned);
    return { success: true };
  });

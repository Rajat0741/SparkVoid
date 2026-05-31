"use server";

import { authActionClient } from "@/lib/safe-action";
import { deleteConversation } from "../services/delete-conversation";
import { getConversation } from "@/features/common/services/get-conversation";
import z from "zod";
import { AppError } from "@/utils/app-error";

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
      throw new AppError("Unauthorized access", 403);
    }
    await deleteConversation(conversationId);
    return { success: true };
  });

"use server";

import { authActionClient } from "@/lib/safe-action";
import { findConversationById, updateConversationTitle } from "@/lib/db/queries";
import { AppError } from "@/utils/app-error";
import z from "zod";

const renameConversationSchema = z.object({
  conversationId: z.string(),
  title: z.string().min(1, "Title is required"),
});

export const renameConversationAction = authActionClient
  .inputSchema(renameConversationSchema)
  .action(async ({ parsedInput: { conversationId, title }, ctx }) => {
    const conversation = await findConversationById(conversationId);

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    if (conversation.userId !== ctx.user.id) {
      throw new AppError("Unauthorized to rename this conversation", 403);
    }

    await updateConversationTitle(conversationId, title);
    return { success: true };
  });

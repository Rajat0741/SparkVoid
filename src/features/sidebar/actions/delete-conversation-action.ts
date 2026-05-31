"use server";

import { authActionClient } from "@/lib/safe-action";
import { deleteConversation } from "../services/delete-conversation";
import z from "zod";

const deleteConversationSchema = z.object({
  conversationId: z.string(),
});

export const deleteConversationAction = authActionClient
  .inputSchema(deleteConversationSchema)
  .action(async ({ parsedInput: { conversationId }, ctx }) => {
    await deleteConversation(conversationId, ctx.user.id);
    return { success: true };
  });

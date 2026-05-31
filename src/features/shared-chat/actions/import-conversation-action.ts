"use server";

import { authActionClient } from "@/lib/safe-action";
import { getSharedConversation } from "../services/get-shared-conversation";
import { importConversation } from "../services/import-conversation";
import { AppError } from "@/utils/app-error";
import { z } from "zod";

const importConversationSchema = z.object({
  conversationId: z.string(),
});

export const importConversationAction = authActionClient
  .inputSchema(importConversationSchema)
  .action(async ({ parsedInput: { conversationId }, ctx }) => {
    const conversation = await getSharedConversation(conversationId);

    if (!conversation) {
      throw new AppError("Shared conversation not found", 404);
    }

    const newConversationId = await importConversation(
      conversationId,
      conversation.title,
      ctx.user.id
    );

    return { newConversationId };
  });

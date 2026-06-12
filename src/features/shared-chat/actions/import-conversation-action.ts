"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  findSharedConversation,
  findMessagesByConversationId,
  insertConversation,
  insertMessageBatch,
  deleteConversationById,
} from "@/lib/db/queries";
import { AppError } from "@/utils/app-error";
import { generateId } from "ai";
import { z } from "zod";

const importConversationSchema = z.object({
  conversationId: z.string(),
});

export const importConversationAction = authActionClient
  .inputSchema(importConversationSchema)
  .action(async ({ parsedInput: { conversationId }, ctx }) => {
    const conversation = await findSharedConversation(conversationId);

    if (!conversation) {
      throw new AppError("Shared conversation not found", 404);
    }

    const newConversationId = generateId();

    // Step 1: create the new conversation owned by the importing user
    await insertConversation({
      id: newConversationId,
      userId: ctx.user.id,
      title: conversation.title,
      isShared: false,
    });

    // Step 2: fetch source messages and bulk-insert clones
    // Note: neon-http doesn't support real transactions, so we clean up manually on failure
    try {
      const sourceMessages = await findMessagesByConversationId(conversationId);

      await insertMessageBatch(
        sourceMessages.map((msg) => ({
          id: generateId(),
          conversationId: newConversationId,
          role: msg.role,
          parts: msg.parts,
          metadata: msg.metadata,
          createdAt: msg.createdAt,
        })),
      );
    } catch (error) {
      console.error("Failed to copy messages during import — rolling back conversation:", error);
      await deleteConversationById(newConversationId);
      throw new AppError("Failed to import conversation", 500);
    }

    return { newConversationId };
  });

"use server"

import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema/messages";
import { CustomUIMessage } from "@/types";

export const createMessage = async ({message, conversationId}: { message: CustomUIMessage, conversationId: string }) => {
    const result = await db
        .insert(messages)
        .values({
            conversationId: conversationId,
            role: message.role,
            metadata: message.metadata,
            parts: message.parts
        })
        .returning();

    return result;
};

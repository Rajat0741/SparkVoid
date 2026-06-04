import { db } from "@/lib/db";
import { messages, NewMessageType } from "@/lib/db/schema/messages";
import { CustomUIMessage } from "@/types";

export const createMessage = async ({message, conversationId}: { message: CustomUIMessage, conversationId: string }): Promise<NewMessageType> => {
    const [result] = await db
        .insert(messages)
        .values({
            id: message.id,
            conversationId: conversationId,
            role: message.role,
            metadata: message.metadata,
            parts: message.parts
        })
        .returning();

    return result;
};

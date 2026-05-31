"use server"

import { db } from "@/lib/db"
import { messages, MessageType } from "@/lib/db/schema"
import { AppError } from "@/utils/app-error"
import { asc, eq } from "drizzle-orm"

export const getConversationHistory = async (conversationId: string) => {
    try {
        const conversationHistory: MessageType[] = await db
            .select()
            .from(messages)
            .where(eq(messages.conversationId, conversationId))
            .orderBy(asc(messages.createdAt));

        return conversationHistory;
    } catch (error) {
        console.error("Failed to get conversation history:", error);
        throw new AppError("Failed to get conversation history", 500);
    }
}

"use server"

import { db } from "@/lib/db"
import { messages, MessageType } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"

export const getConversationHistory = async (conversationId: string) => {

    const conversationHistory: MessageType[] = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(asc(messages.createdAt))

    return conversationHistory

}

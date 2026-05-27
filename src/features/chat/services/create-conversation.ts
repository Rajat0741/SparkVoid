"use server"

import { db } from "@/lib/db"
import { conversations, NewConversationType } from "@/lib/db/schema"

export const createConversation = async (userId: string, data: NewConversationType) => {
    try {
        const { id, title } = data;

        const newConversation = await db
            .insert(conversations)
            .values({
                id,
                userId,
                title,
            })
            .returning();

        return newConversation[0];
        
    } catch (error) {
        console.error("Failed to create conversation:", error);
        throw new Error("Failed to create conversation");
    }
}
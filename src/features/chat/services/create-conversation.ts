"use server"

import { db } from "@/lib/db";
import { NewConversationType } from "@/lib/db/schema";
import { conversations } from "@/lib/db/schema";

export const createConversation = async (userId: string, data:NewConversationType ) => {

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

}
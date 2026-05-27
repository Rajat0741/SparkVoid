"use server"

import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ConversationType } from "@/lib/db/schema/conversations";

export const getConversations = async ( userId: string ) => {

    const retrieved_conversations:ConversationType[] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId));

    return retrieved_conversations;

}

import { db } from "@/lib/db"
import { conversations } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { ConversationType } from "@/lib/db/schema"

export const getConversations = async (userId: string) => {
    try {
        const retrievedConversations: ConversationType[] = await db
            .select()
            .from(conversations)
            .where(eq(conversations.userId, userId))
            .orderBy(desc(conversations.createdAt));

        return retrievedConversations;
    } catch (error) {
        console.error("Failed to get conversations:", error);
        throw new Error("Failed to get conversations");
    }
}

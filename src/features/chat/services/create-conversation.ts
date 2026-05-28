import { db } from "@/lib/db"
import { conversations, NewConversationType } from "@/lib/db/schema"

export const createConversation = async ( data: NewConversationType) => {
    try {
        const { title } = data;

        const newConversation = await db
            .insert(conversations)
            .values({
                id: data.id,
                userId: data.userId,
                title,
            })
            .onConflictDoNothing()
            .returning();

        return newConversation[0];
        
    } catch (error) {
        console.error("Failed to create conversation:", error);
        throw new Error("Failed to create conversation");
    }
}

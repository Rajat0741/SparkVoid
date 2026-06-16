import { getUserSession } from "@/lib/getUser";
import { NewConversationType } from "@/lib/db/schema";
import { insertConversation } from "@/lib/db/queries";

export const createConversation = async (request: Request, conversationId: string): Promise<{ userId: string }> => {
    const userSession = await getUserSession(request.headers);

    const newConversationData: NewConversationType = {
        id: conversationId,
        title: "New Conversation",
        userId: userSession.user.id,
    };

    await insertConversation(newConversationData);

    return { userId: userSession.user.id };

};

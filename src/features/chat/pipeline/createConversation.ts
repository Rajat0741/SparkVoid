import { getUserSession } from "@/lib/getUser";
import { NewConversationType } from "@/lib/db/schema";
import { insertConversation, findMessagesByConversationId, updateConversationTitle } from "@/lib/db/queries";
import { generateText } from "ai";
import { google } from "@/features/chat/models/providerInstance";
import { CustomUIMessage } from "@/types";

const generateConversationTitle = async (conversationId: string, messageText: string) => {
  try {
    const { text } = await generateText({
      model: google("gemma-4-31b-it"),
      prompt: `Generate a concise, one-line title for a conversation starting with this message. Return ONLY the title text without quotes or punctuation.\n\nMessage:\n${messageText}`,
    });

    const title = text.trim();
    if (title) {
      await updateConversationTitle(conversationId, title);
    }
  } catch (error) {
    console.error("Failed to generate title:", error);
  }
};

export const createConversation = async (request: Request, conversationId: string, message: CustomUIMessage): Promise<{ userId: string }> => {
    const userSession = await getUserSession(request.headers);

    const history = await findMessagesByConversationId(conversationId);

    if (history.length === 0) {
        const newConversationData: NewConversationType = {
            id: conversationId,
            title: "New Conversation",
            userId: userSession.user.id,
        };

        await insertConversation(newConversationData);

        const messageText = message.parts
          .filter((part) => part.type === "text")
          .map((part) => ("text" in part && typeof part.text === "string" ? part.text : ""))
          .join(" ");

        // Fire and forget
        generateConversationTitle(conversationId, messageText).catch(console.error);
    }

    return { userId: userSession.user.id };
};

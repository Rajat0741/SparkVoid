import { NewConversationType } from "@/lib/db/schema";
import { insertConversation, updateConversationTitle } from "@/lib/db/queries";
import { generateText } from "ai";
import { google } from "@/features/chat/models/providerInstance";
import { CustomUIMessage } from "@/types";

const generateConversationTitle = async (conversationId: string, messageText: string) => {
  try {
    const { text } = await generateText({
      model: google("gemma-4-26b-a4b-it"),
      prompt: `Generate a concise, one-line title for a conversation starting with this message. Return ONLY the title text without quotes or punctuation.\n\nMessage:\n${messageText}`,
      maxOutputTokens: 100,
    });

    const title = text.trim();
    if (title) {
      await updateConversationTitle(conversationId, title);
    }
  } catch (error) {
    console.error("Failed to generate title:", error);
  }
};

export const createConversation = async (
  userId: string,
  conversationId: string,
  message: CustomUIMessage,
): Promise<void> => {

  const messageText = message.parts
    .filter((part) => part.type === "text")
    .map((part) => ("text" in part && typeof part.text === "string" ? part.text : ""))
    .join(" ");

  const title = messageText.split(" ").slice(0, 6).join(" ") + (messageText.split(" ").length > 6 ? "..." : "");
  
  const newConversationData: NewConversationType = {
    id: conversationId,
    title,
    userId,
  };

  await insertConversation(newConversationData);

  // Fire and forget
  generateConversationTitle(conversationId, messageText).catch(console.error);
};

import { createConversation } from "@/features/chat/services/create-conversation";
import { createMessage } from "@/features/chat/services/create-message";
import { getConversationHistory } from "@/features/chat/services/get-messages";
import { linkPendingAttachments } from "@/features/chat/services/link-attachments";
import { NewConversationType } from "@/lib/db/schema";
import { CustomUIMessage } from "@/types";
import { AppError } from "@/utils/app-error";
import { getUserSession } from "@/lib/getUser";
import { toUIMessage } from "@/utils/toUIMessage";

export interface PreparedChatRequest {
  messages: CustomUIMessage[];
  conversationId: string;
}

/**
 * Handles all pre-streaming work: auth, conversation upsert, history load,
 * and persisting the incoming user message.
 *
 * Returns the full message array (history + new message) ready for the AI model.
 */
export async function prepareChatRequest(
  request: Request,
): Promise<PreparedChatRequest> {
  let body: { conversationId: string; message: CustomUIMessage };

  try {
    body = await request.json();
  } catch {
    throw new AppError("Invalid request body", 400);
  }

  const { conversationId, message } = body;

  if (!conversationId || !message) {
    throw new AppError("Missing conversationId or message", 400);
  }

  const userSession = await getUserSession(request.headers);

  const newConversationData: NewConversationType = {
    id: conversationId,
    title: "title",
    userId: userSession.user.id,
  };

  await createConversation(newConversationData);

  const conversationHistory = await getConversationHistory(conversationId);
  const messages: CustomUIMessage[] = toUIMessage(conversationHistory);

  messages.push(message);

  // Filter reasoning messages
  const filteredMessages: CustomUIMessage[] = messages.map((msg) => ({
    ...msg,
    parts: msg.parts.filter((part) => part.type !== "reasoning"),
  }));

  const newAttachmentURLs = message.parts.filter(((part) => part.type=="file")).map((part)=>part.url) || [];

  await createMessage({ message, conversationId });

  // Link pending attachments to the message
  await linkPendingAttachments({
    userId: userSession.user.id,
    messageId: message.id,
    conversationId,
    attachmentURLs: newAttachmentURLs,
  });

  return { messages: filteredMessages, conversationId };
}

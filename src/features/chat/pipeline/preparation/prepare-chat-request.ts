import {
  insertConversation,
  findMessagesByConversationId,
  insertMessage,
  linkPendingAttachments,
  updateConversationTimestamp,
} from "@/lib/db/queries";
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

  await insertConversation(newConversationData);

  const conversationHistory = await findMessagesByConversationId(conversationId);
  const messages: CustomUIMessage[] = toUIMessage(conversationHistory);

  messages.push(message);

  // Filter reasoning parts before sending to the model
  const filteredMessages: CustomUIMessage[] = messages.map((msg) => ({
    ...msg,
    parts: msg.parts.filter((part) => part.type !== "reasoning"),
  }));

  const newAttachmentURLs = message.parts
    .filter((part) => part.type === "file")
    .map((part) => part.url);

  await insertMessage({
    id: message.id,
    conversationId,
    role: message.role,
    metadata: message.metadata,
    parts: message.parts,
  });

  // Update conversation timestamp to reflect new activity
  await updateConversationTimestamp(conversationId);

  // Link pending attachments to the persisted message
  await linkPendingAttachments(
    userSession.user.id,
    message.id,
    conversationId,
    newAttachmentURLs,
  );

  return { messages: filteredMessages, conversationId };
}

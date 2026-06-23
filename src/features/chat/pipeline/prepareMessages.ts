import {
  findMessagesByConversationId,
  insertMessage,
  linkPendingAttachments,
  updateConversationTimestamp,
} from "@/lib/db/queries";
import { toUIMessage } from "@/utils/toUIMessage";
import { CustomUIMessage } from "@/types";

export type PreparedMessages = {
  messages: CustomUIMessage[];
};

export const prepareMessages = async (
  userId: string,
  conversationId: string,
  message: CustomUIMessage,
): Promise<PreparedMessages> => {
  const conversationHistory = await findMessagesByConversationId(conversationId);
  const messages = toUIMessage(conversationHistory);

  messages.push(message);

  // Filter reasoning parts before sending to the model
  const filteredMessages: CustomUIMessage[] = messages.map((msg) => ({
    ...msg,
    parts: msg.parts.filter((part) => part.type !== "reasoning"),
  }));

  const newAttachmentUrls = message.parts
    .filter((part) => part.type === "file")
    .map((part) => part.url);

  await Promise.all([
    insertMessage({
      id: message.id,
      conversationId,
      role: message.role,
      metadata: message.metadata,
      parts: message.parts,
    }),
    updateConversationTimestamp(conversationId),
  ]);

  await linkPendingAttachments(
    userId,
    message.id,
    conversationId,
    newAttachmentUrls,
  );

  return {
    messages: filteredMessages,
  };
};

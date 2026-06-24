import { insertMessage, linkPendingAttachments, updateConversationTimestamp } from "@/lib/db/queries";
import { CustomUIMessage } from "@/types";

export const saveMessage = async (
  userId: string,
  conversationId: string,
  message: CustomUIMessage,
): Promise<void> => {

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
};

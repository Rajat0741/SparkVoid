import { db } from "@/lib/db";
import {
  insertMessage,
  updateConversationTimestamp,
  linkPendingAttachments,
} from "@/lib/db/queries";
import { CustomUIMessage } from "@/types";

export const saveMessage = async (
  userId: string,
  conversationId: string,
  message: CustomUIMessage,
): Promise<void> => {
  const attachmentUrls = message.parts
    .filter((part) => part.type === "file")
    .map((part) => part.url);
  await db.transaction(async (tx) => {
    await insertMessage(
      {
        id: message.id,
        conversationId,
        role: message.role,
        metadata: message.metadata,
        parts: message.parts,
      },
      tx,
    );
    await linkPendingAttachments(userId, message.id, conversationId, attachmentUrls, tx);
    await updateConversationTimestamp(conversationId, tx);
  });
};

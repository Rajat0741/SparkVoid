import { CustomUIMessage } from "@/types";
import { ModelId } from "../validators";
import { fetchHistory } from "./fetchHistory";
import { createConversation } from "./createConversation";
import { saveMessage } from "./saveMessage";
import { prepareMessage } from "./prepareMessage";
import { inlineFileUrlParts } from "../../../utils/inlineFileUrls";
import { streamAIResponse } from "./stream-response";
import { db } from "@/lib/db";
import {
  deleteMessagesByIds,
  findAttachmentsByMessageIds,
} from "@/lib/db/queries";
import { deleteUnreferencedAttachments } from "@/lib/imagekit";

export interface ExecutePersistentPipelineParams {
  userId: string;
  conversationId: string;
  model?: ModelId;
  userMessage: CustomUIMessage;
}

export const executePersistentPipeline = async ({
  userId,
  conversationId,
  model,
  userMessage,
}: ExecutePersistentPipelineParams): Promise<Response> => {
  const history = await fetchHistory(conversationId);

  if (history.length === 0) {
    await createConversation(userId, conversationId, userMessage);
  }

  // Check if userMessage is an existing message in history (i.e. regeneration)
  const targetIndex = history.findIndex((msg) => msg.id === userMessage.id);
  let historyToKeep = history;

  if (targetIndex !== -1) {
    const messagesToPrune = history.slice(targetIndex + 1);
    const pruneIds = messagesToPrune.map((msg) => msg.id);

    if (pruneIds.length > 0) {
      await db.transaction(async (tx) => {
        const relatedAttachments = await findAttachmentsByMessageIds(
          conversationId,
          pruneIds,
          tx,
        );

        if (relatedAttachments.length > 0) {
          const excludedAttachmentIds = relatedAttachments.map((a) => a.id);
          await deleteUnreferencedAttachments(
            relatedAttachments,
            excludedAttachmentIds,
          );
        }

        await deleteMessagesByIds(conversationId, pruneIds, tx);
      });
    }

    historyToKeep = history.slice(0, targetIndex);
  }

  await saveMessage(userId, conversationId, userMessage);

  const messages = prepareMessage(historyToKeep, userMessage);
  const inlinedMessages = await inlineFileUrlParts(messages);

  return streamAIResponse(inlinedMessages, conversationId, model, userId, {
    persistMessages: true,
  });
};

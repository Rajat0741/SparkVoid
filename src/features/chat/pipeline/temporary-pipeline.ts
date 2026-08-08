import { CustomUIMessage } from "@/types";
import { ModelId } from "../validators";
import { prepareMessage } from "./prepareMessage";
import { streamAIResponse } from "./stream-response";

export interface ExecuteTemporaryPipelineParams {
  userId: string;
  conversationId: string;
  model?: ModelId;
  userMessage: CustomUIMessage;
  temporaryHistory: CustomUIMessage[];
}

export const executeTemporaryPipeline = async ({
  userId,
  conversationId,
  model,
  userMessage,
  temporaryHistory,
}: ExecuteTemporaryPipelineParams): Promise<Response> => {
  const messages = prepareMessage(temporaryHistory, userMessage);

  return streamAIResponse(messages, conversationId, model, userId, {
    persistMessages: false,
  });
};

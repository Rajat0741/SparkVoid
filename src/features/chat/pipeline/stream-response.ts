import { convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse } from "ai";
import { generateId } from "better-auth";
import { type CustomUIMessage, type MetadataType } from "@/types";
import { insertMessage, updateConversationTimestamp, recordAndGetUsage } from "@/lib/db/queries";
import { Spark } from "../models/Spark";
import { Void } from "../models/Void";
import { ModelId } from "../validators";
import { AppError } from "@/utils/app-error";
import * as Sentry from "@sentry/nextjs";

export const streamAIResponse = async (
  messages: CustomUIMessage[],
  conversationId: string,
  model: ModelId | undefined,
  userId: string,
  options: { persistMessages: boolean },
): Promise<Response> => {

  const agent = model === "void" ? Void : Spark;
  const baseModel = model ?? "spark";

  Sentry.metrics.count('agent_selected', 1, { attributes: { agent: baseModel } });

  const result = agent.stream({
    messages: await convertToModelMessages(messages),
  });

  const agentResult = await result;

  const uiStream = toUIMessageStream({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stream: agentResult.stream as any,
    generateMessageId: generateId,
    onError: (error) => {
      if (error instanceof AppError) {
        return error.message;
      }
      return "An unexpected error occurred during generation.";
    },
    messageMetadata: ({ part }) => {
      if (part.type === "start") {
        return { model: baseModel };
      }
      if (part.type === "finish") {
        return {
          totalTokens: part.totalUsage?.totalTokens ?? 0,
          model: baseModel,
        } as MetadataType;
      }
    },
    onEnd: async ({ responseMessage }) => {
      const assistantMessage = responseMessage as CustomUIMessage;
      const totalTokens = (assistantMessage?.metadata as MetadataType)?.totalTokens ?? 0;

      const persistOperations = options.persistMessages
        ? [
          insertMessage({
            id: assistantMessage.id,
            conversationId,
            role: assistantMessage.role,
            metadata: assistantMessage.metadata,
            parts: assistantMessage.parts,
          }),
          updateConversationTimestamp(conversationId),
        ]
        : [];

      await Promise.all([
        recordAndGetUsage(userId, totalTokens),
        ...persistOperations,
      ]);
    },
  });

  return createUIMessageStreamResponse({
    stream: uiStream,
  });
};

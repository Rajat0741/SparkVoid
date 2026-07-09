import { convertToModelMessages } from "ai";
import { generateId } from "better-auth";
import { type CustomUIMessage, type MetadataType } from "@/types";
import { insertMessage, updateConversationTimestamp, recordAndGetUsage } from "@/lib/db/queries";
import { Spark } from "../models/Spark";
import { Void } from "../models/Void";
import { ModelId } from "../validators";
import { AppError } from "@/utils/app-error";

export const streamAIResponse = async (
  messages: CustomUIMessage[],
  conversationId: string,
  model: ModelId | undefined,
  userId: string,
  options: { persistMessages: boolean },
): Promise<Response> => {

  const agent = model === "void" ? Void : Spark;

  const result = agent.stream({
    messages: await convertToModelMessages(messages),
  });

  return (await result).toUIMessageStreamResponse({
    generateMessageId: generateId,
    onError: (error) => {
      if (error instanceof AppError) {
        return error.message;
      }
      return "An unexpected error occurred during generation.";
    },
    messageMetadata: ({ part }) => {
      const baseModel = model ?? "spark";
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
    onFinish: async (aiMessage) => {
      const assistantMessage = aiMessage.messages.at(-1) as CustomUIMessage;
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
            console.log("Message persisted", assistantMessage),
          ]
        : [];

      await Promise.all([
        recordAndGetUsage(userId, totalTokens),
        ...persistOperations,
      ]);
    },
  });
};


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
      if (part.type === "start") {
        return { model: model ?? "spark" };
      }
      if (part.type === "finish") {
        const meta: MetadataType = {
          totalTokens: part.totalUsage?.totalTokens ?? 0 ,
          model: model ?? "spark",
        };
        return meta;
      }
    },
    onFinish: async (aiMessage) => {
      const assistantMessage = aiMessage.messages.at(-1) as CustomUIMessage;
      const totalTokens = (assistantMessage?.metadata as MetadataType)?.totalTokens ?? 0;

      await Promise.all([
        insertMessage({
          id: assistantMessage.id,
          conversationId,
          role: assistantMessage.role,
          metadata: assistantMessage.metadata,
          parts: assistantMessage.parts,
        }),
        updateConversationTimestamp(conversationId),
        recordAndGetUsage(userId, totalTokens),
      ]);
    },
  });
};

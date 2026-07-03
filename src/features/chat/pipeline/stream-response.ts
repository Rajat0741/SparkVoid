import { convertToModelMessages } from "ai";
import { generateId } from "better-auth";
import { type CustomUIMessage, type MetadataType } from "@/types";
import { insertMessage, updateConversationTimestamp } from "@/lib/db/queries";
import { Spark } from "../models/Spark";
import { Void } from "../models/Void";
import { ModelId } from "../validators";

export const streamAIResponse = async (
  messages: CustomUIMessage[],
  conversationId: string,
  model?: ModelId,
): Promise<Response> => {

  const agent = model === "void" ? Void : Spark;

  const result = agent.stream({
    messages: await convertToModelMessages(messages),
  });

  return (await result).toUIMessageStreamResponse({
    generateMessageId: generateId,
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
          await insertMessage({
            id: assistantMessage.id,
            conversationId,
            role: assistantMessage.role,
            metadata: assistantMessage.metadata,
            parts: assistantMessage.parts,
          });
          await updateConversationTimestamp(conversationId);
        },
  });
};

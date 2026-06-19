import { convertToModelMessages, smoothStream } from "ai";
import { generateId } from "better-auth";
import { CustomUIMessage, MetadataType } from "@/types";
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
    experimental_transform: smoothStream({ delayInMs: 20 }),
  });

  return (await result).toUIMessageStreamResponse({
    generateMessageId: generateId,
    messageMetadata: ({ part }) => {
      if (part.type === "finish") {
        const meta: MetadataType = {
          tokens: part.totalUsage.totalTokens ?? 0,
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

import { createMessage } from "@/features/chat/services/create-message";
import { SYSTEM_PROMPT } from "@/features/chat/constants/prompts";
import { CustomUIMessage, MetadataType } from "@/types";
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderOptions,
} from "@ai-sdk/google";
import { convertToModelMessages, generateId, streamText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

/**
 * Configures the AI model, starts streaming, and returns the streaming Response.
 * Persists the assistant message to the DB inside onFinish.
 */
export async function streamAIResponse(
  messages: CustomUIMessage[],
  conversationId: string,
): Promise<Response> {
  const model = google("gemini-3.1-flash-lite");

  const result = streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    providerOptions: {
      google: {
        thinkingConfig: {
          includeThoughts: true,
          thinkingLevel: "high",
        },
      } satisfies GoogleGenerativeAIProviderOptions,
    },
  });

  return result.toUIMessageStreamResponse({
    generateMessageId: generateId,
    messageMetadata: ({ part }) => {
      if (part.type === "finish") {
        const meta: MetadataType = {
          tokens: part.totalUsage.totalTokens ?? 0,
        };
        return meta;
      }
    },
    onFinish: async (aiMessage) => {
      const assistantMessage = aiMessage.messages.at(-1) as CustomUIMessage;
      await createMessage({ message: assistantMessage, conversationId });
    },
  });
}

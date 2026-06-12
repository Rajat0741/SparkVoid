import { insertMessage, updateConversationTimestamp } from "@/lib/db/queries";
import { SYSTEM_PROMPT } from "@/features/chat/constants/prompts";
import { CustomUIMessage, MetadataType } from "@/types";
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderOptions,
} from "@ai-sdk/google";
import { tavilySearch } from "@tavily/ai-sdk";
import { webSearch } from "@exalabs/ai-sdk";
import {
  convertToModelMessages,
  generateId,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { FirecrawlTools } from "firecrawl-aisdk";
import { weatherTool } from "@/lib/tools/get-weather";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const { systemPrompt, ...tools } = FirecrawlTools();

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
    experimental_transform: smoothStream({
      delayInMs: 20,
    }),
    providerOptions: {
      google: {
        thinkingConfig: {
          includeThoughts: true,
          thinkingLevel: "high",
        },
      } satisfies GoogleGenerativeAIProviderOptions,
    },
    tools: {
      ...tools,
      weatherTool,
      webSearch: webSearch({
        type: "neural",
      }),
      tavilySearch: tavilySearch({
        searchDepth: "advanced",
        includeAnswer: true,
        maxResults: 8,
        topic: "general",
      }),
    },
    stopWhen: stepCountIs(15),
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
}

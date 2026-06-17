import { stepCountIs, ToolLoopAgent } from "ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { weatherTool } from "@/lib/tools/get-weather";
import { tavilySearch } from "@tavily/ai-sdk";
import { FirecrawlTools } from "firecrawl-aisdk";
import { google } from "./providerInstance";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { systemPrompt, ...firecrawlTools } = FirecrawlTools();

export const Void = new ToolLoopAgent({
  model: google("gemini-3.1-flash-lite"),
  instructions: "You are a helpful assistant.",
  providerOptions: {
    google: {
      thinkingConfig: {
        includeThoughts: true,
        thinkingLevel: "high",
      },
    } satisfies GoogleGenerativeAIProviderOptions
  },
  tools: {
    weather: weatherTool,
    tavilySearch: tavilySearch({
      searchDepth: "advanced",
      includeAnswer: true,
      maxResults: 8,
    }),
    Scrape: firecrawlTools.scrape,
  },
  stopWhen: stepCountIs(12),
});

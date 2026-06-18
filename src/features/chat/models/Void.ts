import { stepCountIs, ToolLoopAgent } from "ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { weatherTool } from "@/lib/tools/get-weather";
import { tavilySearch } from "@tavily/ai-sdk";
import { firecrawlTools } from "@/lib/tools/firecrawl";
import { google } from "./providerInstance";
import { Void_Prompt } from "../prompts";

export const Void = new ToolLoopAgent({
  model: google("gemini-3.1-flash-lite"),
  instructions: Void_Prompt(),
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
    tavilyWebSearch: tavilySearch({
      searchDepth: "advanced",
      includeAnswer: true,
      maxResults: 8,
    }),
    Scrape: firecrawlTools.scrape,
    web_search: firecrawlTools.search,
  },
  stopWhen: stepCountIs(12),
});

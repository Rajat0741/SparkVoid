import { stepCountIs, ToolLoopAgent } from "ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { weatherTool } from "@/lib/tools/get-weather";
import { firecrawlTools } from "@/lib/tools/firecrawl";
import { google } from "./providerInstance";
import { VOID_PROMPT } from "../prompts";

export const Void = new ToolLoopAgent({
  model: google("gemini-3.1-flash-lite"),
  instructions: VOID_PROMPT(),
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
    Scrape: firecrawlTools.scrape,
    web_search: firecrawlTools.search,
  },
  stopWhen: stepCountIs(12),
});

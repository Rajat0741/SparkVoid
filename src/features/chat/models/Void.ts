import { isStepCount, ToolLoopAgent } from "ai";
import { GoogleLanguageModelOptions } from "@ai-sdk/google";
import { weatherTool } from "@/lib/tools/get-weather";
import { firecrawlTools } from "@/lib/tools/firecrawl";
import { google, googleTwo } from "./providerInstance";
import { VOID_PROMPT } from "../prompts";

import { createFallback } from "ai-fallback";

export const Void = new ToolLoopAgent({
  model: createFallback({
    models: [
      googleTwo("gemini-3.1-flash-lite"),
      google("gemini-3.1-flash-lite"),
    ],
  }),
  instructions: VOID_PROMPT(),
  providerOptions: {
    google: {
      thinkingConfig: {
        includeThoughts: true,
        thinkingLevel: "high",
      },
    } satisfies GoogleLanguageModelOptions
  },
  tools: {
    "get-weather": weatherTool,
    "Scrape-firecrawl": firecrawlTools.scrape,
    "web-search-firecrawl": firecrawlTools.search,
  },
  stopWhen: isStepCount(12),
});

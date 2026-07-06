import { stepCountIs, ToolLoopAgent } from "ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { weatherTool } from "@/lib/tools/get-weather";
import { google, googleTwo } from "./providerInstance";
import { SPARK_PROMPT } from "../prompts";
import { tavilySearch } from "@tavily/ai-sdk";

import { createFallback } from "ai-fallback";

export const Spark = new ToolLoopAgent({
  model: createFallback({
    models: [
      google("gemini-3.1-flash-lite"),
      googleTwo("gemini-3.1-flash-lite"),
    ],
  }),
  instructions: SPARK_PROMPT(),
  providerOptions:{
    google: {
        thinkingConfig: {
            includeThoughts: true,
            thinkingLevel: "high",
        }
    } satisfies GoogleGenerativeAIProviderOptions
  },
  tools: {
    "get-weather": weatherTool,
    "web-search-tavily": tavilySearch({
      searchDepth: "advanced",
      includeAnswer: true,
      maxResults: 8,
    }),
  },
  stopWhen: stepCountIs(5)
});

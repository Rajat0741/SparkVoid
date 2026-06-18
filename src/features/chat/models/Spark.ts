import { stepCountIs, ToolLoopAgent } from "ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { weatherTool } from "@/lib/tools/get-weather";
import { google } from "./providerInstance";
import { SPARK_PROMPT } from "../prompts";
import { tavilySearch } from "@tavily/ai-sdk";

export const Spark = new ToolLoopAgent({
  model: google("gemini-3.1-flash-lite"),
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
    weather: weatherTool,
    tavilyWebSearch: tavilySearch({
      searchDepth: "advanced",
      includeAnswer: true,
      maxResults: 8,
    }),
  },
  stopWhen: stepCountIs(5)
});

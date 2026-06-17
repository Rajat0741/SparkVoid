import { stepCountIs, ToolLoopAgent } from "ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { weatherTool } from "@/lib/tools/get-weather";
import { google } from "./providerInstance";

export const Spark = new ToolLoopAgent({
  model: google("gemini-3.1-flash-lite"),
  instructions: "You are a helpful assistant.",
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
  },
  stopWhen: stepCountIs(5)
});

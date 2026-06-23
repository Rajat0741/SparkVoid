import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const googleTwo = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_TWO_API_KEY,
});

import { createGoogle } from "@ai-sdk/google";

export const google = createGoogle({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const googleTwo = createGoogle({
  apiKey: process.env.GOOGLE_TWO_API_KEY,
});

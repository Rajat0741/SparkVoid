import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderOptions,
} from "@ai-sdk/google";
import { convertToModelMessages, generateId, streamText, type UIMessage } from "ai";


const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(request: Request) {
  try {
    // TODO: fetch only query from user and full conversation history from database
    const { messages }: { messages: UIMessage[] } = await request.json();

    const model = google("gemini-3.1-flash-lite");

    const result = streamText({
      model: model,
      system:
        "You are a helpful assistant. Think about what user wants and provide a concise answer. If you don't know the answer, say you don't know.",
      messages: await convertToModelMessages(messages),
      providerOptions: {
        google: {
          thinkingConfig: {
            includeThoughts: true,
            thinkingLevel: "high",
          },
        } satisfies GoogleGenerativeAIProviderOptions,
      },
    });

    return result.toUIMessageStreamResponse({
      generateMessageId: generateId,
      messageMetadata: () => ({
        // TODO: add tokens usage and createdat after database implementation
        model: model,
      }),
      onFinish: (message) => {
        // TODO: implement database saving here
        console.log(JSON.stringify(message, null, 2));
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: `${error}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

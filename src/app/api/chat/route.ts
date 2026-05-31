import { AppError } from "@/utils/app-error";
import { prepareChatRequest } from "@/features/chat/pipeline/preparation/prepare-chat-request";
import { streamAIResponse } from "@/features/chat/pipeline/streaming/stream-ai-response";

export async function POST(request: Request) {
  try {
    const { messages, conversationId } = await prepareChatRequest(request);
    return await streamAIResponse(messages, conversationId);
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof AppError) {
      return Response.json({ error: error.message }, { status: error.statusCode });
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

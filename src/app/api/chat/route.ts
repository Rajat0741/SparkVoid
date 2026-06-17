import { AppError } from "@/utils/app-error";
import { streamAIResponse } from "@/features/chat/pipeline/stream-response";
import { parseRequest } from "@/features/chat/pipeline/parseRequest";
import { createConversation } from "@/features/chat/pipeline/createConversation";
import { prepareMessages } from "@/features/chat/pipeline/prepareMessages";

export async function POST(request: Request) {
  try {
    const { message, conversationId, model } = await parseRequest(request);
    const { userId } = await createConversation(request, conversationId);
    const { messages } = await prepareMessages(userId, conversationId, message);

    return await streamAIResponse(messages, conversationId, model);
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof AppError) {
      return Response.json({ error: error.message }, { status: error.statusCode });
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

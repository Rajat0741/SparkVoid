import { AppError } from "@/utils/app-error";
import { streamAIResponse } from "@/features/chat/pipeline/stream-response";
import { parseRequest } from "@/features/chat/pipeline/parseRequest";
import { fetchHistory } from "@/features/chat/pipeline/fetchHistory";
import { createConversation } from "@/features/chat/pipeline/createConversation";
import { saveMessage } from "@/features/chat/pipeline/saveMessage";
import { prepareMessage } from "@/features/chat/pipeline/prepareMessage";
import { getUserSession } from "@/lib/getUser";

export async function POST(request: Request) {
  try {
    
    const { message, conversationId, model } = await parseRequest(request);
    const history = await fetchHistory(conversationId);
    
    const userId = (await getUserSession(request.headers)).user.id;

    if (history.length === 0) {
      await createConversation(userId, conversationId, message);
    }

    await saveMessage(userId, conversationId, message);

    const messages = prepareMessage(history, message);

    return await streamAIResponse(messages, conversationId, model);
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof AppError) {
      return Response.json({ error: error.message }, { status: error.statusCode });
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

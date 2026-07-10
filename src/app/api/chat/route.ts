import { AppError } from "@/utils/app-error";
import { streamAIResponse } from "@/features/chat/pipeline/stream-response";
import { parseRequest } from "@/features/chat/pipeline/parseRequest";
import { fetchHistory } from "@/features/chat/pipeline/fetchHistory";
import { createConversation } from "@/features/chat/pipeline/createConversation";
import { saveMessage } from "@/features/chat/pipeline/saveMessage";
import { prepareMessage } from "@/features/chat/pipeline/prepareMessage";
import { getUserSession } from "@/lib/getUser";
import { checkUserQuota } from "@/features/chat/pipeline/checkUserQuota";
import { CustomUIMessage } from "@/types";
import * as Sentry from "@sentry/nextjs";

export async function POST(request: Request) {
  try {
    
    const [parsedRequest, session] = await Promise.all([
      parseRequest(request),
      getUserSession(request.headers),
    ]);
    
    const userId = session.user.id;
    const { conversationId, model, message, temporary, history: temporaryHistory } = parsedRequest;

    if (temporary) {
      Sentry.metrics.count('incognito_session_started', 1);
    }

    await checkUserQuota(userId);

    let messages: CustomUIMessage[];

    if (temporary) {
      messages = prepareMessage(temporaryHistory, message);
    } else {

      const history = await fetchHistory(conversationId);
      if (history.length === 0) {
        await createConversation(userId, conversationId, message);
      }
      await saveMessage(userId, conversationId, message);
      messages = prepareMessage(history, message);

    }

    return await streamAIResponse(messages, conversationId, model, userId, {
      persistMessages: !temporary,
    });
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof AppError) {
      return new Response(error.message, { status: error.statusCode });
    }

    return new Response("Internal server error", { status: 500 });
  }
}

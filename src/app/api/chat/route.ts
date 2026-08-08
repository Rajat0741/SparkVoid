import { AppError } from "@/utils/app-error";
import { parseRequest } from "@/features/chat/pipeline/parseRequest";
import { getUserSession } from "@/lib/getUser";
import { checkUserQuota } from "@/features/chat/pipeline/checkUserQuota";
import { executeTemporaryPipeline } from "@/features/chat/pipeline/temporary-pipeline";
import { executePersistentPipeline } from "@/features/chat/pipeline/persistent-pipeline";
import * as Sentry from "@sentry/nextjs";

export async function POST(request: Request) {
  try {
    const [parsedRequest, session] = await Promise.all([
      parseRequest(request),
      getUserSession(request.headers),
    ]);

    const userId = session.user.id;
    const {
      conversationId,
      model,
      message: userMessage,
      temporary,
      history: temporaryHistory,
    } = parsedRequest;

    Sentry.metrics.count("session_started", 1, {
      attributes: {
        mode: temporary ? "incognito" : "regular",
      },
    });

    await checkUserQuota(userId);

    if (temporary) {
      return await executeTemporaryPipeline({
        userId,
        conversationId,
        model,
        userMessage,
        temporaryHistory,
      });
    }

    return await executePersistentPipeline({
      userId,
      conversationId,
      model,
      userMessage,
    });
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof AppError) {
      return new Response(error.message, { status: error.statusCode });
    }

    return new Response("Internal server error", { status: 500 });
  }
}

import { AppError } from "@/utils/app-error";
import { findConversationsByUserId } from "@/lib/db/queries";
import { getUserSession } from "@/lib/getUser";

export async function GET(request: Request) {
  try {
    const userSession = await getUserSession(request.headers);
    const conversations = await findConversationsByUserId(userSession.session.userId);
    return Response.json({ conversations });
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof AppError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return Response.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}

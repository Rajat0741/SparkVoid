import { AppError } from "@/utils/app-error";
import { findConversationsByUserId } from "@/lib/db/queries";
import { getUserSession } from "@/lib/getUser";

export async function POST(request: Request) {
  try {
    const { limit, cursor: rawCursor, query } = await request.json();
    const cursor = rawCursor ? new Date(rawCursor) : undefined;
    const userSession = await getUserSession(request.headers);
    const conversations = await findConversationsByUserId(
      userSession.session.userId,
      limit,
      cursor,
      query,
    );
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

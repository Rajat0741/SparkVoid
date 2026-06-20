import { AppError } from "@/utils/app-error";
import { findConversationById } from "@/lib/db/queries";
import { getUserSession } from "@/lib/getUser";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userSession = await getUserSession(request.headers);
    const conversation = await findConversationById(id);

    if (!conversation) {
      return Response.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    if (conversation.userId !== userSession.session.userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    return Response.json({ conversation });
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof AppError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    return Response.json(
      { error: "Failed to fetch conversation" },
      { status: 500 },
    );
  }
}

import { AppError } from "@/utils/app-error";
import { getConversations } from "@/features/sidebar/services/get-conversations";
import { getUserSession } from "@/utils/getUser";

export async function GET(request: Request) {
  try {

    const userSession = await getUserSession(request.headers);

    const conversations = await getConversations(userSession.session.userId);
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

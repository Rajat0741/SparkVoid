import { RequestSchema } from "../validators";
import { validateUIMessages } from "ai";
import { CustomUIMessage } from "@/types";
import { AppError } from "@/utils/app-error";

export const parseRequest = async (request: Request) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new AppError("Invalid request body", 400);
  }
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    throw new AppError(parsed.error.message, 400);
  }

  const requestedHistory = parsed.data.temporaryHistory ?? [];

  const [validatedMessage] = await validateUIMessages({
    messages: [parsed.data.message],
  });

  if (!validatedMessage) {
    throw new AppError("Invalid message payload", 400);
  }

  const validatedHistory = requestedHistory.length > 0
    ? (await validateUIMessages({ messages: requestedHistory })) as CustomUIMessage[]
    : [];

  return {
    conversationId: parsed.data.conversationId,
    message: validatedMessage as CustomUIMessage,
    history: validatedHistory,
    temporary: parsed.data.temporary ?? false,
    model: parsed.data.model,
  };
}

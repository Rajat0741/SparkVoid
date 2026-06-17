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

  const message = await validateUIMessages({
    messages: [parsed.data.message],
  });

  return {
    conversationId: parsed.data.conversationId,
    message: message[0] as CustomUIMessage,
    model: parsed.data.model as "spark" | "void" | undefined,
  };
}

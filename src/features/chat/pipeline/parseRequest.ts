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

  // AI sdk do not exports UIMessage schema, so zod cannot be used to validate the message shape. 
  // We use the AI SDK's runtime validator instead.
  const message = await validateUIMessages({
    messages: [parsed.data.message],
  });

  return {
    conversationId: parsed.data.conversationId,
    message: message[0] as CustomUIMessage,
  };
}

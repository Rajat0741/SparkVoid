import { type UIMessage, type UseChatHelpers } from "@ai-sdk/react";

export type SendMessageFunctionType = UseChatHelpers<UIMessage>["sendMessage"];
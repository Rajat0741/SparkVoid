import { type UIMessage, type UseChatHelpers } from "@ai-sdk/react";

export type SendMessageFunctionType = UseChatHelpers<UIMessage>["sendMessage"];

export interface MetadataType {
    model: string;
    tokens: number;
    createdAt: string;
}

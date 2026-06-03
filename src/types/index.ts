import { type UIMessage, type UseChatHelpers } from "@ai-sdk/react";
import { UIDataTypes, UITools } from "ai";

export type SendMessageFunctionType = UseChatHelpers<UIMessage>["sendMessage"];

// Custom UIMessage type with custom metadata, UIDataTypes and UITools schemas

export interface MetadataType {
    tokens: number;
}

export type CustomUIMessage = UIMessage<MetadataType, UIDataTypes, UITools>;

export type MessagePart = CustomUIMessage["parts"][number];

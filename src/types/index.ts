import { type UIMessage, type UseChatHelpers } from "@ai-sdk/react";
import { UIDataTypes, UITools } from "ai";

export interface MetadataType {
    tokens?: number;
}

// Custom UIMessage type with custom metadata, UIDataTypes and UITools schemas

export type CustomUIMessage = UIMessage<MetadataType, UIDataTypes, UITools>;

export type MessagePart = CustomUIMessage["parts"][number];

export type SendMessageFunctionType = UseChatHelpers<CustomUIMessage>["sendMessage"];

export type stopGenerationFunctionType = UseChatHelpers<CustomUIMessage>["stop"];

export type clearErrorFunctionType = UseChatHelpers<CustomUIMessage>["clearError"];
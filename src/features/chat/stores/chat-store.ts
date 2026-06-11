import { createStore, type StoreApi } from "zustand";
import type { ChatStatus } from "ai";
import type {
  clearErrorFunctionType,
  CustomUIMessage,
  SendMessageFunctionType,
  stopGenerationFunctionType,
} from "@/types";

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

export interface ChatState {
  conversationId: string;
  messages: CustomUIMessage[];
  status: ChatStatus;
  error: Error | undefined;
  sendMessage: SendMessageFunctionType;
  stop: stopGenerationFunctionType;
  clearError: clearErrorFunctionType;
}

export type ChatStore = StoreApi<ChatState>;

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates an isolated Zustand store instance for a single conversation.
 * Using `createStore` (not `create`) ensures no global singleton is shared
 * across conversations — each ChatProvider mounts its own instance.
 */
export const createChatStore = (initial: ChatState): ChatStore => {
  return createStore<ChatState>()(() => initial);
};

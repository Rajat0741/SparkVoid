"use client";

import { createContext, use, useEffect, useState } from "react";
import { useStore } from "zustand";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getConversationQueryOptions } from "@/features/sidebar/services/get-conversations-query";
import { createChatStore, type ChatState, type ChatStore } from "@/features/chat/stores/chat-store";
import type { CustomUIMessage } from "@/types";

// ---------------------------------------------------------------------------
// Context — holds the *store reference*, never the data.
// A stable reference means this Context never triggers re-renders by itself.
// ---------------------------------------------------------------------------

const ChatStoreContext = createContext<ChatStore | null>(null);

function useChatStore(): ChatStore {
  const store = use(ChatStoreContext);
  if (!store) {
    throw new Error("useChatContext must be used within a <ChatProvider>");
  }
  return store;
}

/**
 * Subscribe to a fine-grained slice of the chat store.
 * Only re-renders the calling component when the selected slice changes,
 * eliminating the per-token full-tree re-render caused by React Context.
 *
 * @example
 *   const messages = useChatContext((s) => s.messages);
 *   const status   = useChatContext((s) => s.status);
 */
export function useChatContext<T>(selector: (state: ChatState) => T): T {
  return useStore(useChatStore(), selector);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ChatProviderProps {
  conversationId: string;
  initialMessages: CustomUIMessage[];
  children: React.ReactNode;
}

/**
 * Owns the useChat hook for a single conversation and exposes its state
 * via a per-instance Zustand store. Consumers select only the slice they
 * need, so streaming token updates do not re-render unrelated components.
 */
export function ChatProvider({
  conversationId,
  initialMessages,
  children,
}: ChatProviderProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { messages, sendMessage, status, error, stop, clearError } = useChat<CustomUIMessage>({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ id, messages: msgs }) => ({
        body: {
          conversationId: id,
          message: msgs.at(-1),
        },
      }),
    }),
  });

  useEffect(() => {
    if (status === "streaming") {
      queryClient.invalidateQueries({
        queryKey: getConversationQueryOptions().queryKey,
      });
    }
  }, [status, queryClient]);

  const handleSendMessage: typeof sendMessage = async (message, options) => {
    if (pathname === "/chat") {
      history.pushState(null, "", `/chat/${conversationId}`);
    }
    return sendMessage(message, options);
  };

  // useState with a lazy initializer creates the store exactly once per mount.
  // Reading `store` during render is safe (unlike useRef.current).
  const [store] = useState<ChatStore>(() =>
    createChatStore({
      conversationId,
      messages,
      status,
      error,
      sendMessage: handleSendMessage,
      stop,
      clearError,
    }),
  );

  // Keep the store in sync with the latest useChat values after every render.
  // useEffect (no deps array) runs after every commit. Zustand's internal
  // shallow equality ensures subscribers only fire when their slice changes.
  useEffect(() => {
    store.setState({
      conversationId,
      messages,
      status,
      error,
      sendMessage: handleSendMessage,
      stop,
      clearError,
    });
  });

  return <ChatStoreContext value={store}>{children}</ChatStoreContext>;
}

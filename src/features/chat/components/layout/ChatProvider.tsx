"use client";

import { createContext, ReactNode, use, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getConversationQueryOptions } from "@/features/common/queries/get-conversations-query";
import { createChatStore, type ChatState, type ChatStore } from "@/features/chat/stores/chat-store";
import type { CustomUIMessage } from "@/types";
import type { ModelId } from "@/features/chat/validators";

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
  isTemporaryChat: boolean;
  children: ReactNode;
}

/**
 * Owns the useChat hook for a single conversation and exposes its state
 * via a per-instance Zustand store. Consumers select only the slice they
 * need, so streaming token updates do not re-render unrelated components.
 *
 * `isTemporaryChat` is accepted as a prop (set by the parent page) so the
 * transport always knows the session type without triggering a re-mount.
 * The store exposes `setTemporaryChat` so the in-chat toggle updates state
 * instantly — no router navigation required.
 */
export function ChatProvider({
  conversationId,
  initialMessages,
  isTemporaryChat: initialIsTemporaryChat,
  children,
}: ChatProviderProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // A stable ref lets the transport closure read the latest isTemporaryChat
  // at message-send time without ever recreating the transport object.
  // `temporaryChatRef` (the ref object) is captured by the closure; `.current`
  // is only read inside `prepareSendMessagesRequest` — an event handler,
  // not during render.
  const temporaryChatRef = useRef<boolean>(initialIsTemporaryChat);

  // React Compiler handles memoization. The transport captures `temporaryChatRef`
  // (the ref object) and reads `.current` only at send-time, never during render.
  /* eslint-disable react-hooks/refs */
  const transport = new DefaultChatTransport({
    api: "/api/chat",
    prepareSendMessagesRequest: ({ id, messages: msgs, body }) => ({
      body: {
        conversationId: id,
        message: msgs.at(-1),
        temporaryHistory: temporaryChatRef.current ? msgs.slice(0, -1) : undefined,
        temporary: temporaryChatRef.current,
        model: (body as { model?: ModelId })?.model,
      },
    }),
  });

  const { messages, sendMessage, status, error, stop, clearError, regenerate, setMessages } =
    useChat<CustomUIMessage>({
      id: conversationId,
      messages: initialMessages,
      transport,
    });

  useEffect(() => {
    if (status === "streaming") {
      queryClient.invalidateQueries({
        queryKey: getConversationQueryOptions().queryKey,
      });
    }
  }, [status, queryClient]);

  const handleSendMessage: typeof sendMessage = async (message, options) => {
    if (pathname === "/chat" && !temporaryChatRef.current) {
      history.pushState(null, "", `/chat/${conversationId}`);
    }
    return sendMessage(message, options);
  };

  // useState with a lazy initializer creates the store exactly once per mount.
  // handleSendMessage closes over temporaryChatRef but only reads .current at
  // call-time (event handler), not during this initialization.
  // eslint-disable-next-line react-hooks/refs
  const [store] = useState<ChatStore>(() =>
    createChatStore({
      conversationId,
      messages,
      status,
      error,
      isTemporaryChat: initialIsTemporaryChat,
      sendMessage: handleSendMessage,
      stop,
      clearError,
      regenerate,
      setMessages,
    }),
  );

  // Keep temporaryChatRef in sync whenever the store's isTemporaryChat changes
  useEffect(() => {
    return store.subscribe((state) => {
      temporaryChatRef.current = state.isTemporaryChat;
    });
  }, [store]);

  // Keep all other useChat-derived values in sync after every render.
  // Zustand's internal shallow equality ensures subscribers only fire
  // when their selected slice actually changes.
  useEffect(() => {
    store.setState({
      conversationId,
      messages,
      status,
      error,
      sendMessage: handleSendMessage,
      stop,
      clearError,
      regenerate,
      setMessages,
    });
  });

  return <ChatStoreContext value={store}>{children}</ChatStoreContext>;
}

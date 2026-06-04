"use client";

import { createContext, use, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getConversationQueryOptions } from "@/features/sidebar/services/get-conversations-query";
import type { CustomUIMessage, SendMessageFunctionType } from "@/types";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ChatContextValue {
  messages: CustomUIMessage[];
  status: string;
  error: Error | undefined;
  sendMessage: SendMessageFunctionType;
}

const ChatContext = createContext<ChatContextValue | null>(null);

/**
 * Returns the nearest ChatContext value.
 * Throws if called outside of a <ChatProvider>.
 */
export function useChatContext(): ChatContextValue {
  const ctx = use(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within a <ChatProvider>");
  }
  return ctx;
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
 * to all descendants via context, removing the need for prop drilling
 * through layout intermediaries.
 */
export function ChatProvider({
  conversationId,
  initialMessages,
  children,
}: ChatProviderProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { messages, sendMessage, status, error } = useChat<CustomUIMessage>({
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

  return (
    <ChatContext
      value={{
        messages,
        status,
        error,
        sendMessage: handleSendMessage,
      }}
    >
      {children}
    </ChatContext>
  );
}

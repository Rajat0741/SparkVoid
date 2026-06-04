"use client";

import NewChatView from "./NewChatView";
import ChatConversation from "./ChatConversation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { CustomUIMessage } from "@/types";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getConversationQueryOptions } from "@/features/sidebar/services/get-conversations-query";

export default function ChatInterface({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: CustomUIMessage[];
}) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { messages, sendMessage, status, error } = useChat<CustomUIMessage>({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          conversationId: id,
          message: messages.at(-1),
        },
      }),
    }),
  });

  useEffect(() => {
    if (status === "streaming") {
      queryClient.invalidateQueries({ queryKey: getConversationQueryOptions().queryKey });
    }
  }, [status, queryClient]);

  const handleSendMessage: typeof sendMessage = async (message, options) => {
    if (pathname === "/chat") {
      history.pushState(null, "", `/chat/${conversationId}`);
    }
    return sendMessage(message, options);
  };

  if (messages.length === 0) {
    return <NewChatView sendMessage={handleSendMessage} />;
  }

  return (
    <ChatConversation
      messages={messages}
      status={status}
      error={error}
      sendMessage={handleSendMessage}
    />
  );
}

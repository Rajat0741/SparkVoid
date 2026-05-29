"use client";

import NewChatView from "./NewChatView";
import ChatConversation from "./ChatConversation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname, useRouter } from "next/navigation";
import { CustomUIMessage } from "@/types";
import { UIMessage, UIDataTypes, UITools } from "ai";

export default function ChatInterface({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: CustomUIMessage[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { messages, sendMessage, status, error } = useChat({
    id: conversationId,
    onFinish: () => router.refresh(),
    messages: initialMessages as UIMessage<unknown, UIDataTypes, UITools>[],
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

  const handleSendMessage: typeof sendMessage = async (message, options) => {
    if (pathname === "/chat") {
      window.history.replaceState(null, "", `/chat/${conversationId}`);
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

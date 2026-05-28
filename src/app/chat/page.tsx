"use client";

import ChatUI from "@/features/chat/components/conversation/ChatUI";
import PromptUI from "@/features/chat/components/PromptUI";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
export default function ChatPage() {
  // TODO: Implement trigger and messageID when implementing retry functionality
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest:  ({ id, messages }) => ({
        body: {
          conversationId: id,
          message: messages.at(-1)
        }
      })
    })
  });

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <ChatUI messages={messages} status={status} error={error} />
      <PromptUI sendMessage={sendMessage} />
    </div>
  );
}

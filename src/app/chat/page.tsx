"use client";

import ChatUI from "@/features/chat/components/conversation/ChatUI";
import PromptUI from "@/features/chat/components/PromptUI";
import { useChat } from "@ai-sdk/react";
export default function ChatPage() {
  const { messages, sendMessage, status, error } = useChat();

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <ChatUI messages={messages} status={status} error={error} />
      <PromptUI sendMessage={sendMessage} />
    </div>
  );
}

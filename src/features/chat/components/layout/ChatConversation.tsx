"use client";

import ChatUI from "@/features/chat/components/conversation/ChatUI";
import PromptUI from "@/features/chat/components/prompt/PromptUI";
import type { SendMessageFunctionType, CustomUIMessage } from "@/types";

interface ChatConversationProps {
  messages: CustomUIMessage[];
  status: string;
  error: Error | undefined;
  sendMessage: SendMessageFunctionType;
}

export default function ChatConversation({
  messages,
  status,
  error,
  sendMessage,
}: ChatConversationProps) {
  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-4 pb-4 overflow-hidden">
      <div className="flex-1 min-h-0 w-full relative">
        <ChatUI messages={messages} status={status} error={error} />
      </div>
      <div className="shrink-0 w-full mt-4">
        <PromptUI sendMessage={sendMessage} />
      </div>
    </div>
  );
}

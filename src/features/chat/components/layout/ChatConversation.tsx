"use client";

import ChatUI from "@/features/chat/components/conversation/ChatUI";
import PromptUI from "@/features/chat/components/prompt/PromptUI";

export default function ChatConversation() {
  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-4 pb-4 overflow-hidden">
      <div className="flex-1 min-h-0 w-full relative">
        <ChatUI />
      </div>
      <div className="shrink-0 w-full mt-4">
        <PromptUI />
      </div>
    </div>
  );
}

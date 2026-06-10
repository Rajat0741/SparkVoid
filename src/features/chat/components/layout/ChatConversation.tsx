"use client";

import ChatUI from "@/features/chat/components/conversation/ChatUI";
import PromptUI from "@/features/chat/components/prompt/PromptUI";

export default function ChatConversation() {
  return (
    <div className="flex flex-col size-full max-w-208 mx-auto px-4 pb-4 overflow-hidden">
      <div className="flex-1 min-h-0 w-full relative">
        <ChatUI />
      </div>
      <PromptUI className="w-full max-w-3xl mx-auto mt-4" />
    </div>
  );
}

"use client";

import Image from "next/image";
import ChatUI from "@/features/chat/components/conversation/ChatUI";
import PromptUI from "@/features/chat/components/prompt/PromptUI";
import { ChatProvider, useChatContext } from "./ChatProvider";
import type { CustomUIMessage } from "@/types";

function ChatContent() {
  const messageCount = useChatContext((s) => s.messages.length);

  if (messageCount === 0) {
    return (
      <div className="flex flex-col items-center md:justify-center md:gap-10 flex-1 w-full max-w-2xl mx-auto px-4 pt-16 pb-4 md:py-0 h-full">
        {/* Mobile Header */}
        <div className="flex-1 flex items-center justify-center w-full md:hidden">
          <h1 className="text-3xl text-foreground select-none text-center">
            What do you want to know?
          </h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-3 select-none">
          <Image src="/icon.svg" alt="SparkVoid Logo" width={48} height={48} className="size-12 shrink-0" />
          <h1
            className="text-5xl text-foreground"
            aria-label="SparkVoid"
          >
            SparkVoid
          </h1>
        </div>
        <PromptUI className="w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col size-full pb-4 overflow-hidden">
      <div className="flex-1 min-h-0 w-full relative">
        <ChatUI />
      </div>
      <PromptUI className="w-full max-w-3xl mx-auto px-2" />
    </div>
  );
}

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages: CustomUIMessage[];
}

export default function ChatInterface({
  conversationId,
  initialMessages,
}: ChatInterfaceProps) {
  return (
    <ChatProvider conversationId={conversationId} initialMessages={initialMessages}>
      <ChatContent />
    </ChatProvider>
  );
}

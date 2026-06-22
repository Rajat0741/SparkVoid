"use client";

import NewChatView from "./NewChatView";
import ChatUI from "@/features/chat/components/conversation/ChatUI";
import PromptUI from "@/features/chat/components/prompt/PromptUI";
import { ChatProvider, useChatContext } from "./ChatProvider";
import type { CustomUIMessage } from "@/types";

function ChatContent() {
  const messageCount = useChatContext((s) => s.messages.length);

  if (messageCount === 0) {
    return <NewChatView />;
  }

  return (
    <div className="flex flex-col size-full max-w-215 mx-auto pb-4 overflow-hidden">
      <div className="flex-1 min-h-0 w-full relative">
        <ChatUI />
      </div>
      <PromptUI className="w-full max-w-3xl mx-auto px-2 md:px-0" />
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

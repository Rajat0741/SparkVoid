"use client";

import NewChatView from "./NewChatView";
import ChatConversation from "./ChatConversation";
import { ChatProvider, useChatContext } from "./ChatProvider";
import type { CustomUIMessage } from "@/types";

function ChatContent() {
  const messageCount = useChatContext((s) => s.messages.length);

  if (messageCount === 0) {
    return <NewChatView />;
  }

  return <ChatConversation />;
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

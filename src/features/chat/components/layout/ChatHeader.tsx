"use client";

import { useQuery } from "@tanstack/react-query";
import { ConversationActions } from "@/features/common/components";
import { getConversationDetailQueryOptions } from "@/features/common/queries/get-conversation-detail-query";

interface ChatHeaderProps {
  conversationId: string;
}

export default function ChatHeader({ conversationId }: ChatHeaderProps) {
  const { data: conversation } = useQuery(
    getConversationDetailQueryOptions(conversationId),
  );

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-sm">
      <p className="truncate text-sm font-medium text-muted-foreground">{conversation?.title ?? "New Conversation"}</p>
      {conversation && <ConversationActions conversation={conversation} />}
    </header>
  );
}

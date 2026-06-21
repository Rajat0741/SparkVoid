"use client";

import { useQuery } from "@tanstack/react-query";
import type { LanguageModelUsage } from "ai";
import { ConversationActions } from "@/features/common/components";
import { getConversationDetailQueryOptions } from "@/features/common/queries/get-conversation-detail-query";
import { useChatContext } from "./ChatProvider";
import {
  Context,
  ContextTrigger,
  ContextContent,
  ContextContentHeader,
  ContextContentBody,
  ContextInputUsage,
  ContextOutputUsage,
} from "@/components/ai-elements/context";

const MAX_CONTEXT_TOKENS = 200_000;

export default function ChatHeader() {
  const conversationId = useChatContext((s) => s.conversationId);
  const messageCount = useChatContext((s) => s.messages.length);
  const messages = useChatContext((s) => s.messages);

  const { data: conversation } = useQuery(
    getConversationDetailQueryOptions(conversationId),
  );

  const lastMsg = messages.at(-1);
  const inputTokens =
    lastMsg?.role === "assistant" ? lastMsg.metadata?.inputTokens ?? 0 : 0;
  const outputTokens =
    lastMsg?.role === "assistant" ? lastMsg.metadata?.outputTokens ?? 0 : 0;
  const totalTokens = inputTokens + outputTokens;

  if (messageCount === 0) return null;

  const usage: LanguageModelUsage = {
    inputTokens,
    outputTokens,
    totalTokens,
    inputTokenDetails: {
      noCacheTokens: undefined,
      cacheReadTokens: undefined,
      cacheWriteTokens: undefined,
    },
    outputTokenDetails: {
      textTokens: undefined,
      reasoningTokens: undefined,
    },
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <p className="truncate text-sm">{conversation?.title ?? "New Conversation"}</p>
      </div>

      <div className="flex items-center gap-1">
        <Context
          usedTokens={totalTokens}
          maxTokens={MAX_CONTEXT_TOKENS}
          usage={usage}
        >
          <ContextTrigger />
          <ContextContent align="end" className="min-w-44 pb-3">
            <ContextContentHeader />
            <ContextContentBody className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Last Turn Context</p>
              <ContextInputUsage />
              <ContextOutputUsage />
            </ContextContentBody>
          </ContextContent>
        </Context>
        {conversation && <ConversationActions conversation={conversation} side="bottom" />}
      </div>
    </header>
  );
}

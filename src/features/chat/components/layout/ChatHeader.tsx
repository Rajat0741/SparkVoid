"use client";

import { useMemo } from "react";
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

  const { totalTokens, inputTokens, outputTokens } =
    useMemo(() => {
      let input = 0;
      let output = 0;

      for (const msg of messages) {
        if (msg.role === "user") {
          const text = msg.parts
            .filter((p): p is { type: "text"; text: string } => p.type === "text")
            .map((p) => p.text)
            .join(" ");
          input += Math.ceil(text.length / 4);
        } else if (msg.role === "assistant" && msg.metadata) {
          const meta = msg.metadata as Record<string, number | undefined>;
          output += meta.outputTokens ?? 0;
        }
      }

      return {
        totalTokens: input + output,
        inputTokens: input,
        outputTokens: output,
      };
    }, [messages]);

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

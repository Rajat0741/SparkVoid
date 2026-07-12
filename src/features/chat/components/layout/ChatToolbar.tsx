"use client";

import { HatGlasses, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConversationActions } from "@/features/common/components";
import { getConversationDetailQueryOptions } from "@/features/common/queries/get-conversation-detail-query";
import { useChatContext } from "./ChatProvider";

/**
 * Absolutely-positioned overlay at top-right of the chat area.
 *
 * Empty chat  →  incognito toggle
 * Temporary + has messages  →  subtle incognito indicator
 * Persistent + has messages  →  ConversationActions menu
 */
export function ChatToolbar() {
  const router = useRouter();
  const messages = useChatContext((s) => s.messages);
  const isTemporaryChat = useChatContext((s) => s.isTemporaryChat);
  const setTemporaryChat = useChatContext((s) => s.setTemporaryChat);
  const conversationId = useChatContext((s) => s.conversationId);

  const hasMessages = messages.length > 0;

  // Only fetch when we're in a persistent conversation with messages.
  const { data: conversation } = useQuery({
    ...getConversationDetailQueryOptions(conversationId),
    enabled: hasMessages && !isTemporaryChat,
  });

  return (
    <div className="fixed top-4 right-4 z-20 flex gap-2 rounded-xl backdrop-blur-xl border-2">
      <Button
        variant="ghost"
        size="lg"
        onClick={() => router.push("/chat")}
        aria-label="New chat"
        className="md:hidden"
      >
        <Plus className="size-6" />
      </Button>
      {!hasMessages || isTemporaryChat ? (
        <Tooltip>
          <TooltipTrigger render={<span />}>
            <Toggle
              pressed={isTemporaryChat}
              onPressedChange={setTemporaryChat}
              aria-label="Toggle temporary chat mode"
              className="cursor-pointer"
              disabled={isTemporaryChat && hasMessages}
            >
              <HatGlasses className="size-5" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isTemporaryChat && hasMessages
              ? "Incognito mode active"
              : (isTemporaryChat ? "Disable incognito mode" : "Enable incognito mode"
              )}
          </TooltipContent>
        </Tooltip>
      ) : conversation ? (
        <ConversationActions className="rounded-full md:bg-background p-1 size-10 top-6 right-6" conversation={conversation} side="bottom" align="end" />
      ) : null}
    </div>
  );
}

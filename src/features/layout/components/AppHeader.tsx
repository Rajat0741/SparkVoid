"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { VenetianMask } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getConversationDetailQueryOptions } from "@/features/common/queries/get-conversation-detail-query";
import { ConversationActions } from "@/features/common/components";
import { useTemporaryChat } from "@/features/chat/hooks/use-temporary-chat";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const match = pathname.match(/^\/chat\/([^/]+)$/);
  const conversationId = match?.[1];
  const isNewChatPage = pathname === "/chat";
  const isTemporaryChat = useTemporaryChat();

  const { data: conversation } = useQuery({
    ...getConversationDetailQueryOptions(conversationId ?? ""),
    enabled: !!conversationId,
  });

  return (
    <header className="sticky top-0 min-h-12 bg-transparent z-10 flex justify-between items-center px-4 py-2">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger iconClassName="size-5" />
        <Image src="/icon.svg" alt="SparkVoid Logo" width={24} height={24} className="size-6 shrink-0" />
        <span className="font-bold tracking-tight text-foreground text-base">
          SparkVoid
        </span>
      </div>

      <Link
        href="/pricing"
        className="hidden md:flex text-xs text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-full transition-colors items-center gap-1.5 justify-self-center"
      >
        Free plan <span className="opacity-50">&middot;</span> Upgrade
      </Link>

      <div className="flex items-center min-w-10">
        {isNewChatPage ? (
          <Tooltip>
            <TooltipTrigger render={<span />}>
              <Toggle
                pressed={isTemporaryChat}
                onPressedChange={(pressed) => router.replace(pressed ? "/chat?temporary" : "/chat", { scroll: false })}
                aria-label="Toggle temporary chat mode"
              >
                <VenetianMask className="size-5" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isTemporaryChat ? "Disable temporary chat" : "Enable temporary chat"}
            </TooltipContent>
          </Tooltip>
        ) : conversation ? (
          <ConversationActions conversation={conversation} side="bottom" align="end" />
        ) : null}
      </div>
    </header>
  );
}

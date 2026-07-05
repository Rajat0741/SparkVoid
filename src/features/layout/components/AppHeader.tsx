"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { getConversationDetailQueryOptions } from "@/features/common/queries/get-conversation-detail-query";
import { ConversationActions } from "@/features/common/components";

export function AppHeader() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const match = pathname.match(/^\/chat\/([^/]+)$/);
  const conversationId = match?.[1];

  const { data: conversation } = useQuery({
    ...getConversationDetailQueryOptions(conversationId ?? ""),
    enabled: !!conversationId,
  });

  return (
    <header className="sticky top-0 z-10 grid grid-cols-[1fr_auto_1fr] items-center backdrop-blur px-4 py-2 border-b">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
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

      <div className="flex items-center justify-end min-w-10">
        {conversation && (
          <ConversationActions conversation={conversation} side="bottom" align="end" />
        )}
      </div>
    </header>
  );
}

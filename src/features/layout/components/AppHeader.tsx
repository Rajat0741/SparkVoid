"use client";

import { usePathname } from "next/navigation";
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
    <header className="sticky top-0 z-10 flex items-center justify-between bg-background/80 px-4 py-3 border-b">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <span className="font-bold tracking-tight text-foreground text-base md:hidden">
          SparkVoid
        </span>
      </div>
      {conversation && (
        <div className="flex items-center gap-1">
          <ConversationActions conversation={conversation} side="bottom" />
        </div>
      )}
    </header>
  );
}

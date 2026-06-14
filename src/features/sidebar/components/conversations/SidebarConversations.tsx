"use client";

import { ItemGroup } from "@/components/ui/item";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getConversationQueryOptions } from "@/features/common/queries/get-conversations-query";
import { ConversationItem } from "./ConversationItem";
import Link from "next/link";
import { CircleEllipsis } from "lucide-react";

export function SidebarConversations() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";
  const { data: conversations = [], isLoading } = useQuery(getConversationQueryOptions());

  // Hide completely when collapsed since conversations do not have icons
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 border-t">
      <span className="px-5 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
        Recents
      </span>

      <div className="flex-1 overflow-y-auto px-2">
        {isLoading ? (
          <ConversationLoading />
        ) : conversations.length === 0 ? (
          <ConversationEmpty />
        ) : (
          <ItemGroup className="gap-1 mb-2">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={pathname === `/chat/${conv.id}`}
              />
            ))}
            {conversations.length > 10 && <ViewAll />}
          </ItemGroup>
        )}
      </div>
    </div>
  );
}

function ViewAll() {
  return (
    <Link
      href="/search"
      className="flex items-center gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-all duration-200 border-transparent rounded-lg px-3 py-2.5 text-sm font-sans truncate"
    >
      <CircleEllipsis className="h-4 w-4" />
      All Chats
    </Link>
  );
}

function ConversationLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-20 text-center px-4">
      <p className="text-xs text-muted-foreground font-sans">Loading...</p>
    </div>
  );
}

function ConversationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-20 text-center px-4">
      <p className="text-xs text-muted-foreground font-sans">No conversations found</p>
    </div>
  );
}

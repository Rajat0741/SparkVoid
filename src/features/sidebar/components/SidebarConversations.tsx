"use client";

import { Item, ItemContent, ItemTitle, ItemGroup } from "@/components/ui/item";
import { useSidebar } from "@/components/ui/sidebar";
import { ConversationType } from "@/lib/db/schema";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarConversationsProps {
  conversations: ConversationType[];
}

export function SidebarConversations({ conversations }: SidebarConversationsProps) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";

  // Hide completely when collapsed since conversations do not have icons
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <span className="px-5 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">
        Conversations
      </span>

      <div className="flex-1 overflow-y-auto no-scrollbar px-2">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-20 text-center px-4">
            <p className="text-xs text-muted-foreground font-sans">No conversations found</p>
          </div>
        ) : (
          <ItemGroup className="gap-1">
            {conversations.map((conv) => {
              const isActive = pathname === `/chat/${conv.id}`;
              
              return (
                <Item
                  key={conv.id}
                  variant={isActive ? "muted" : "default"}
                  className={cn(
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-all duration-200",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )}
                  render={<Link href={`/chat/${conv.id}`} />}
                >
                  <ItemContent>
                    <ItemTitle className="text-sm font-sans truncate">
                      {conv.title}
                    </ItemTitle>
                  </ItemContent>
                </Item>
              );
            })}
          </ItemGroup>
        )}
      </div>
    </div>
  );
}

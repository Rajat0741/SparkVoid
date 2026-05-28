"use client";

import { Item, ItemContent, ItemTitle, ItemGroup } from "@/components/ui/item";
import { useSidebar } from "@/components/ui/sidebar";

const mockConversations = [
  { id: "conv_1", title: "Quantum Computing Basics" },
  { id: "conv_2", title: "Next.js 16 Routing Guide" },
  { id: "conv_3", title: "Drizzle Schema Migration" },
];

export function SidebarConversations() {
  const { state } = useSidebar();
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
        {mockConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-20 text-center px-4">
            <p className="text-xs text-muted-foreground font-sans">No conversations found</p>
          </div>
        ) : (
          <ItemGroup className="gap-1">
            {mockConversations.map((conv) => (
              <Item
                key={conv.id}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-all duration-200"
              >
                <ItemContent>
                  <ItemTitle className="text-sm font-sans truncate">{conv.title}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        )}
      </div>
    </div>
  );
}

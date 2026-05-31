"use client";

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ConversationType } from "@/lib/db/schema";

interface ConversationItemProps {
  conversation: ConversationType;
  isActive: boolean;
}

export function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  return (
    <Item
      variant={isActive ? "muted" : "default"}
      className={cn(
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-all duration-200",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      )}
      render={<Link href={`/chat/${conversation.id}`} />}
    >
      <ItemContent>
        <ItemTitle className="text-sm font-sans truncate">
          {conversation.title}
        </ItemTitle>
      </ItemContent>
    </Item>
  );
}

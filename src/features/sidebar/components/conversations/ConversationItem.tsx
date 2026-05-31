"use client";

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ConversationType } from "@/lib/db/schema";
import { ConversationActions } from "./ConversationActions";

interface ConversationItemProps {
  conversation: ConversationType;
  isActive: boolean;
}

export function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  return (
    <div className="relative group/conversation-item">
      <Item
        variant={isActive ? "muted" : "default"}
        className={cn(
          "group-hover/conversation-item:bg-sidebar-accent group-hover/conversation-item:text-sidebar-accent-foreground cursor-pointer transition-all duration-200",
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

      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/conversation-item:opacity-100 transition-opacity">
        <ConversationActions conversationId={conversation.id} />
      </div>
    </div>
  );
}

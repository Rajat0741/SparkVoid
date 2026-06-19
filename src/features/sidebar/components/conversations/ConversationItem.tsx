"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ConversationType } from "@/lib/db/schema";
import { ConversationActions } from "@/features/common/components";
import { Pin } from "lucide-react";
import { useState } from "react";

interface ConversationItemProps {
  conversation: ConversationType;
  isActive: boolean;
}

export function ConversationItem({
  conversation,
  isActive,
}: ConversationItemProps) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const isHighlighted = isActive || actionsOpen;

  return (
    <div className="group/item relative w-full">
      <Link
        href={`/chat/${conversation.id}`}
        className={cn(
          "flex items-center gap-1.5 rounded-lg py-2 pl-3 pr-8 text-sm text-muted-foreground",
          "group-hover/item:bg-sidebar-accent group-hover/item:text-foreground",
          isHighlighted && "bg-sidebar-accent text-foreground",
        )}
      >
        {conversation.isPinned && (
          <Pin className="size-3 shrink-0 text-muted-foreground/50" />
        )}
        <span className="truncate">{conversation.title}</span>
      </Link>

      <ConversationActions
        conversation={conversation}
        className={cn("absolute right-2 top-1/2 z-10 -translate-y-1/2 opacity-0 group-hover/item:opacity-100",
          isHighlighted && "opacity-100"
        )}
        onOpenChange={setActionsOpen}
      />
    </div>
  );
}

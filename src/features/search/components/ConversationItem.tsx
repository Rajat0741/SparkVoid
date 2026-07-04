"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ConversationType } from "@/lib/db/schema";
import { ConversationActions } from "@/features/common/components";
import { Pin } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

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
    <div className="group/item relative flex items-center w-full rounded-lg">
      <Link
        href={`/chat/${conversation.id}`}
        className={cn(
          "flex-1 min-w-0 rounded-lg py-2 pl-3 pr-9 text-accent-foreground",
          "group-hover/item:bg-accent group-hover/item:text-muted-foreground",
          isHighlighted && "bg-accent text-muted-foreground",
        )}
      >
        <span className="flex flex-col gap-0.5">
          <span className="flex items-center gap-2">
            {conversation.isPinned && (
              <Pin className="size-3 shrink-0 text-muted-foreground/50" />
            )}
            <span className="truncate">{conversation.title}</span>
            {conversation.isShared && (
              <Badge
                variant="default"
                className="shrink-0 text-xs px-1.5 py-0"
              >
                Shared
              </Badge>
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(conversation.updatedAt, { addSuffix: true })}
          </span>
        </span>
      </Link>

      <ConversationActions
        conversation={conversation}
        className={cn(
          "absolute right-3 z-10 md:opacity-0 md:group-hover/item:opacity-100",
          isHighlighted && "opacity-100"
        )}
        onOpenChange={setActionsOpen}
      />
    </div>
  );
}

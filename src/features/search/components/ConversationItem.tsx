"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ConversationType } from "@/lib/db/schema";
import { ConversationActions } from "@/features/common/components";
import { Pin } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useLongPress } from "use-long-press";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConversationItemProps {
  conversation: ConversationType;
  isActive: boolean;
}

export function ConversationItem({
  conversation,
  isActive,
}: ConversationItemProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const isMobile = useIsMobile();
  const isHighlighted = isActive || actionsOpen || drawerOpen;

  const bind = useLongPress(() => {
    if (!isMobile) return;
    setDrawerOpen(true);
  }, {
    threshold: 500,
    cancelOnMovement: true,
    onFinish: (event) => {
      if (isMobile) event.preventDefault();
    },
  });

  return (
    <div
      className="group/item relative flex items-center w-full rounded-lg select-none"
      style={{ WebkitTouchCallout: "none" }}
      {...bind()}
    >
      <Link
        href={`/chat/${conversation.id}`}
        className={cn(
          "flex-1 min-w-0 rounded-lg py-2 pl-3 pr-9 text-foreground",
          "group-hover/item:bg-sidebar-accent",
          isHighlighted && "bg-sidebar-accent",
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
        open={isMobile ? drawerOpen : undefined}
        onOpenChange={isMobile ? setDrawerOpen : setActionsOpen}
        className={cn(
          "absolute right-3 z-10 md:opacity-0 md:group-hover/item:opacity-100",
          isHighlighted && !isMobile && "opacity-100"
        )}
      />
    </div>
  );
}

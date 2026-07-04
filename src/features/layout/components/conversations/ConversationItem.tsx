"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ConversationType } from "@/lib/db/schema";
import { ConversationActions } from "@/features/common/components";
import { Pin } from "lucide-react";
import { useCallback, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useLongPress } from "use-long-press";

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
  const { isMobile, setOpenMobile } = useSidebar();
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

  const handleClick = useCallback(
    () => {
      if (isMobile) setOpenMobile(false);
    },
    [isMobile, setOpenMobile],
  );

  return (
    <div
      className="group/item relative w-full select-none"
      style={{ WebkitTouchCallout: "none" }}
      {...bind()}
    >
      <Link
        href={`/chat/${conversation.id}`}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-1.5 rounded-lg py-2 pl-3 text-sm text-muted-foreground",
          isMobile ? "pr-3" : "pr-8",
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
        open={isMobile ? drawerOpen : undefined}
        onOpenChange={isMobile ? setDrawerOpen : setActionsOpen}
        className={cn(
          "absolute right-2 top-1/2 z-10 -translate-y-1/2 opacity-0 group-hover/item:opacity-100",
          isHighlighted && !isMobile && "opacity-100"
        )}
      />
    </div>
  );
}

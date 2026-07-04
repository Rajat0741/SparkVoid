"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ConversationType } from "@/lib/db/schema";
import { ConversationActions } from "@/features/common/components";
import { Pin } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

interface ConversationItemProps {
  conversation: ConversationType;
  isActive: boolean;
}

export function ConversationItem({
  conversation,
  isActive,
}: ConversationItemProps) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const { isMobile, setOpenMobile } = useSidebar();
  const isHighlighted = isActive || actionsOpen;

  return (
    <div className="group/item relative w-full isolate">
      <Link
        href={`/chat/${conversation.id}`}
        onClick={() => isMobile && setOpenMobile(false)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg py-2 pl-3 pr-8 text-base text-muted-foreground",
          "group-hover/item:bg-sidebar-accent group-hover/item:text-sidebar-accent-foreground",
          isHighlighted && "bg-sidebar-accent text-sidebar-accent-foreground",
        )}
      >
        {conversation.isPinned && (
          <Pin className="size-4 shrink-0 text-sidebar-foreground fill-sidebar-foreground" />
        )}
        <span className="truncate">{conversation.title}</span>
      </Link>

      <ConversationActions
        conversation={conversation}
        className={cn(
          "absolute right-2 top-1/2 z-10 -translate-y-1/2 md:opacity-0 md:group-hover/item:opacity-100",
          isHighlighted && "opacity-100 md:opacity-100"
        )}
        onOpenChange={setActionsOpen}
      />
    </div>
  );
}

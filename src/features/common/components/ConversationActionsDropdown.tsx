"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { ConversationType } from "@/lib/db/schema";
import { getConversationActionItems } from "@/features/common/conversation-actions";
import { RenameDialog, ShareDialog, DeleteDialog } from "@/features/common/components";
import { useConversationActions } from "@/features/common/hooks/use-conversation-actions";

interface ConversationActionsProps {
  conversation: ConversationType;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
}

export function ConversationActions({
  conversation,
  className,
  onOpenChange,
  align = "start",
  side = "right",
}: ConversationActionsProps) {
  const {
    isRenameOpen,
    setIsRenameOpen,
    isShareOpen,
    setIsShareOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    onRename,
    onShare,
    onDelete,
    onTogglePin,
  } = useConversationActions(conversation);

  const actionHandlers: Record<string, () => void> = {
    pin: onTogglePin,
    rename: onRename,
    share: onShare,
    delete: onDelete,
  };

  const conversationActionItems = getConversationActionItems(conversation);

  return (
    <div className={className}>
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger
          className="flex items-center justify-center h-6 w-6 rounded hover:bg-sidebar-accent-foreground/10 active:bg-sidebar-accent-foreground/10 cursor-pointer focus-visible:outline-hidden data-popup-open:bg-sidebar-accent-foreground/10"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} side={side}>
          {conversationActionItems.map((item) => (
            <React.Fragment key={item.key}>
              {item.separatorBefore && <DropdownMenuSeparator />}
              <DropdownMenuItem
                variant={item.variant}
                onClick={() => actionHandlers[item.key]()}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {isRenameOpen && (
        <RenameDialog
          conversation={conversation}
          open={isRenameOpen}
          onOpenChange={setIsRenameOpen}
        />
      )}
      {isShareOpen && (
        <ShareDialog
          conversation={conversation}
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
        />
      )}
      {isDeleteOpen && (
        <DeleteDialog
          conversation={conversation}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
        />
      )}
    </div>
  );
}

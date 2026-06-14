"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { ConversationType } from "@/lib/db/schema";
import { conversationActionItems } from "@/features/common/conversation-actions";
import { RenameDialog, ShareDialog, DeleteDialog } from "@/features/common/components";
import { useConversationActions } from "@/features/common/hooks/use-conversation-actions";

interface ConversationActionsProps {
  conversation: ConversationType;
  className?: string;
}

export function ConversationActions({
  conversation,
  className,
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
  } = useConversationActions();

  const dialogHandlers: Record<string, () => void> = {
    rename: onRename,
    share: onShare,
    delete: onDelete,
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center h-6 w-6 rounded hover:bg-sidebar-accent-foreground/10 active:bg-sidebar-accent-foreground/10 cursor-pointer focus-visible:outline-hidden data-popup-open:bg-sidebar-accent-foreground/10"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {conversationActionItems.map((item) => (
            <DropdownMenuItem
              key={item.key}
              variant={item.variant}
              onClick={(e) => {
                e.stopPropagation();
                dialogHandlers[item.key]();
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
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

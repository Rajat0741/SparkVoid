"use client";

import React from "react";
import { MoreVertical, XIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ConversationType } from "@/lib/db/schema";
import { getConversationActionItems } from "@/features/common/conversation-actions";
import { useConversationActions } from "@/features/common/hooks/use-conversation-actions";
import { RenameDialog, ShareDialog, DeleteDialog } from "@/features/common/components";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";

interface ConversationActionsProps {
  conversation: ConversationType;
  className?: string;
  /**
   * Controlled open state (mobile Drawer only).
   * When provided, no trigger button is rendered — the caller controls open/close.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
}


const TRIGGER_CLASS =
  "flex items-center justify-center w-7 h-8 rounded-md hover:bg-sidebar-accent-foreground/10 active:bg-sidebar-accent-foreground/10 cursor-pointer focus-visible:outline-hidden data-popup-open:bg-sidebar-accent-foreground/10 ";

function formatDate(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy");
}

export function ConversationActions({
  conversation,
  className,
  open,
  onOpenChange,
  align = "start",
  side = "right",
}: ConversationActionsProps) {
  const {
    isRenameOpen, setIsRenameOpen,
    isShareOpen, setIsShareOpen,
    isDeleteOpen, setIsDeleteOpen,
    onRename, onShare, onDelete, onTogglePin,
  } = useConversationActions(conversation);

  const isMobile = useIsMobile();

  const handlers: Record<string, () => void> = {
    pin: onTogglePin,
    rename: onRename,
    share: onShare,
    delete: onDelete,
  };

  const items = getConversationActionItems(conversation);

  const dialogs = (
    <>
      {isRenameOpen && (
        <RenameDialog conversation={conversation} open={isRenameOpen} onOpenChange={setIsRenameOpen} />
      )}
      {isShareOpen && (
        <ShareDialog conversation={conversation} open={isShareOpen} onOpenChange={setIsShareOpen} />
      )}
      {isDeleteOpen && (
        <DeleteDialog conversation={conversation} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
      )}
    </>
  );

  if (isMobile) {
    const isControlled = open !== undefined;
    return (
      <>
        <Drawer open={isControlled ? open : undefined} onOpenChange={onOpenChange} showSwipeHandle>
          {!isControlled && (
            <DrawerTrigger className={cn(TRIGGER_CLASS, className)}>
              <MoreVertical className="size-5" />
            </DrawerTrigger>
          )}
          <DrawerContent className={"pb-6 pt-1 px-2 text-base"}>
            <DrawerHeader className="pb-3 border-b">
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col text-left min-w-0">
                  <DrawerTitle className="text-base">
                    {conversation.title ?? "Conversation"}
                  </DrawerTitle>
                  <span className="text-xs text-muted-foreground truncate">
                    Edited {formatDate(conversation.updatedAt)}
                    {conversation.isPinned && " · Pinned"}
                    {conversation.isShared && " · Shared"}
                  </span>
                </div>
                <DrawerClose className="flex size-6 items-center justify-center rounded-md active:bg-accent/80 cursor-pointer shrink-0">
                  <XIcon className="size-5" />
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="flex flex-col pb-safe-area-inset-bottom">
              {items.map((item) => (
                <React.Fragment key={item.key}>
                  {item.separatorBefore && <Separator className="h-px w-full" />}
                  <DrawerClose
                    onClick={() => handlers[item.key]()}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent active:bg-accent/80",
                      item.variant === "destructive" &&
                        "text-destructive hover:bg-destructive/10 active:bg-destructive/15",
                    )}
                  >
                    <item.icon className={cn("size-5 object-contain shrink-0", item.key === "pin" && "fill-current")} />
                    <span className="text-base">{item.label}</span>
                  </DrawerClose>
                </React.Fragment>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
        {dialogs}
      </>
    );
  }

  return (
    <>
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger className={cn(TRIGGER_CLASS, className)}>
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} side={side}>
          {items.map((item) => (
            <React.Fragment key={item.key}>
              {item.separatorBefore && <DropdownMenuSeparator />}
              <DropdownMenuItem
                variant={item.variant}
                onClick={() => handlers[item.key]()}
                className={"gap-2"}
              >
                <item.icon className={cn("size-5", item.key === "pin" && "fill-current")} strokeWidth={1.75} />
                <span className="text-base">{item.label}</span>
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogs}
    </>
  );
}

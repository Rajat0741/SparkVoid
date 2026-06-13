"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { deleteConversationAction } from "@/features/common/actions/delete-conversation-action";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import type { ConversationType } from "@/lib/db/schema";
import { conversationActionItems, RenameDialog, ShareDialog } from "@/features/common/conversation-actions";
import { conversationKeys } from "@/features/search/queries/conversation-keys";

interface ConversationActionsProps {
  conversation: ConversationType;
}

export function ConversationActions({
  conversation,
}: ConversationActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const { execute: executeDelete, isExecuting: isDeleting } = useAction(
    deleteConversationAction,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: conversationKeys.all });
        toast.success("Conversation deleted");
        if (pathname === `/chat/${conversation.id}`) {
          router.push("/chat");
        }
      },
      onError: () => {
        toast.error("Failed to delete conversation");
      },
    }
  );

  const dialogHandlers: Record<string, () => void> = {
    rename: () => setIsRenameOpen(true),
    share: () => setIsShareOpen(true),
    delete: () => executeDelete({ conversationId: conversation.id }),
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
          <div
            role="button"
            tabIndex={0}
            className="flex items-center justify-center h-6 w-6 rounded active:bg-sidebar-accent-foreground/10 cursor-pointer focus-visible:outline-hidden"
          >
            <MoreHorizontal className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {conversationActionItems.map((item) => (
            <DropdownMenuItem
              key={item.key}
              variant={item.variant}
              disabled={item.key === "delete" && isDeleting}
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

      <RenameDialog
        conversation={conversation}
        open={isRenameOpen}
        onOpenChange={setIsRenameOpen}
      />
      <ShareDialog
        conversation={conversation}
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
      />
    </>
  );
}

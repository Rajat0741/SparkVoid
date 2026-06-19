"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { pinConversationAction } from "@/features/common/actions/pin-conversation-action";
import { useQueryClient } from "@tanstack/react-query";
import { conversationKeys } from "@/features/common/queries/conversation-keys";
import { toast } from "sonner";
import type { ConversationType } from "@/lib/db/schema";

export function useConversationActions(conversation: ConversationType) {
  const queryClient = useQueryClient();
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const onRename = () => setIsRenameOpen(true);
  const onShare = () => setIsShareOpen(true);
  const onDelete = () => setIsDeleteOpen(true);

  const { execute: togglePin, isExecuting: isPinning } = useAction(
    pinConversationAction,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: conversationKeys.all });
      },
      onError: () => {
        toast.error("Failed to update pin");
      },
    },
  );

  const onTogglePin = () => {
    togglePin({
      conversationId: conversation.id,
      isPinned: !conversation.isPinned,
    });
  };

  return {
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
    isPinning,
  };
}

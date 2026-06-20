"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { renameConversationAction } from "@/features/common/actions/rename-conversation-action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ConversationType } from "@/lib/db/schema";
import { conversationKeys } from "@/features/common/queries/conversation-keys";

interface RenameDialogProps {
  conversation: ConversationType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameDialog({ conversation, open, onOpenChange }: RenameDialogProps) {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState(conversation.title);

  const { execute, isExecuting } = useAction(renameConversationAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversation.id) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
      queryClient.resetQueries({ queryKey: ["conversations", "infinite"] });
      toast.success("Conversation renamed");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to rename conversation");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    execute({ conversationId: conversation.id, title: trimmed });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
          <DialogDescription>
            Enter a new name for this conversation.
          </DialogDescription>
        </DialogHeader>
        <form id="rename-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Conversation title"
            disabled={isExecuting}
            autoFocus
          />
        </form>
        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isExecuting} />
            }
          >
            Cancel
          </DialogClose>
          <Button type="submit" form="rename-form" disabled={isExecuting || !newTitle.trim()}>
            {isExecuting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

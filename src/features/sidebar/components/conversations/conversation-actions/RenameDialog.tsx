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
import { renameConversationAction } from "@/features/sidebar/actions/rename-conversation-action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ConversationType } from "@/lib/db/schema";

interface RenameDialogProps {
  conversation: ConversationType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameDialog({
  conversation,
  open,
  onOpenChange,
}: RenameDialogProps) {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState(conversation.title);

  // Sync local title state when the conversation title changes externally
  const [prevTitle, setPrevTitle] = useState(conversation.title);
  if (conversation.title !== prevTitle) {
    setPrevTitle(conversation.title);
    setNewTitle(conversation.title);
  }

  const { execute, isExecuting } = useAction(renameConversationAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
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
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
          <DialogDescription>
            Enter a new name for this conversation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Conversation title"
            disabled={isExecuting}
            autoFocus
          />
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isExecuting} />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isExecuting || !newTitle.trim()}>
              {isExecuting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

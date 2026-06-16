"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { deleteConversationAction } from "@/features/common/actions/delete-conversation-action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import type { ConversationType } from "@/lib/db/schema";
import { conversationKeys } from "@/features/common/queries/conversation-keys";

interface DeleteDialogProps {
  conversation: ConversationType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDialog({ conversation, open, onOpenChange }: DeleteDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { execute, isExecuting } = useAction(deleteConversationAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
      queryClient.resetQueries({ queryKey: ["conversations", "infinite"] });
      toast.success("Conversation deleted");
      onOpenChange(false);
      if (pathname === `/chat/${conversation.id}`) {
        router.push("/chat");
      }
    },
    onError: () => {
      toast.error("Failed to delete conversation");
    },
  });

  const handleDelete = () => {
    execute({ conversationId: conversation.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Conversation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isExecuting} />
            }
          >
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isExecuting}
          >
            {isExecuting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

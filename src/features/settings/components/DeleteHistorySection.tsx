"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteAllConversationsAction } from "../actions/delete-all-conversations-action";
import { conversationKeys } from "@/features/common/queries/conversation-keys";

export function DeleteHistorySection() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { execute, isExecuting } = useAction(deleteAllConversationsAction, {
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: conversationKeys.all });
      toast.success("All conversation history deleted");
      setOpen(false);
      router.push("/chat");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete history. Please try again.");
    },
  });

  return (
    <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
      <div>
        <p className="text-sm font-medium">Delete all conversation history</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Permanently removes every conversation. This cannot be undone.
        </p>
      </div>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        className="shrink-0 ml-4"
      >
        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
        Delete all
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete all history?</DialogTitle>
            <DialogDescription>
              Every conversation will be permanently deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose render={<Button variant="outline" disabled={isExecuting} />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => execute()}
              disabled={isExecuting}
            >
              {isExecuting ? "Deleting…" : "Delete all"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

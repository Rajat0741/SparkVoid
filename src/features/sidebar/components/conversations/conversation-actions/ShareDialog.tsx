"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
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
import { shareConversationAction } from "@/features/sidebar/actions/share-conversation-action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ConversationType } from "@/lib/db/schema";

interface ShareDialogProps {
  conversation: ConversationType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({
  conversation,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${conversation.id}`
      : "";

  const { execute, isExecuting } = useAction(shareConversationAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success(
        conversation.isShared
          ? "Conversation is now private"
          : "Conversation is now shared"
      );
    },
    onError: () => {
      toast.error("Failed to update sharing settings");
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Share Conversation</DialogTitle>
          <DialogDescription>
            Generate a public link to share this conversation with others.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/20">
            <div className="space-y-0.5 pr-2">
              <div className="font-medium text-sm">Public link sharing</div>
              <div className="text-xs text-muted-foreground">
                Anyone with this link can view the conversation history
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                execute({
                  conversationId: conversation.id,
                  isShared: !conversation.isShared,
                })
              }
              disabled={isExecuting}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                conversation.isShared ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out",
                  conversation.isShared ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {conversation.isShared && (
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="flex-1 text-xs select-all bg-muted/40 font-mono"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0 size-8"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

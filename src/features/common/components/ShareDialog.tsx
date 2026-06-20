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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAction } from "next-safe-action/hooks";
import { shareConversationAction } from "@/features/common/actions/share-conversation-action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ConversationType } from "@/lib/db/schema";
import { conversationKeys } from "@/features/common/queries/conversation-keys";

interface ShareDialogProps {
  conversation: ConversationType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ conversation, open, onOpenChange }: ShareDialogProps) {
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${conversation.id}`
      : "";

  const { execute, isExecuting } = useAction(shareConversationAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversation.id) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
      queryClient.resetQueries({ queryKey: ["conversations", "infinite"] });
      toast.success(
        conversation.isShared
          ? "Conversation is now private"
          : "Conversation is now shared",
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
      <DialogContent>
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
            <Switch
              checked={conversation.isShared}
              onCheckedChange={(checked) =>
                execute({
                  conversationId: conversation.id,
                  isShared: checked,
                })
              }
              disabled={isExecuting}
            />
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

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { MessageAction } from "@/components/ai-elements/message";
import { useChatContext } from "@/features/chat/components/layout/ChatProvider";
import { useAction } from "next-safe-action/hooks";
import { deleteMessagesAction } from "@/features/chat/actions/message-actions";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
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
import type { CustomUIMessage } from "@/types";

interface RegenerateButtonProps {
  message: CustomUIMessage;
}

export function RegenerateButton({ message }: RegenerateButtonProps) {
  const conversationId = useChatContext((s) => s.conversationId);
  const messages = useChatContext((s) => s.messages);
  const setMessages = useChatContext((s) => s.setMessages);
  const regenerate = useChatContext((s) => s.regenerate);
  const modelId = useChatContext((s) => s.modelId);
  const status = useChatContext((s) => s.status);

  const [isOpen, setIsOpen] = useState(false);

  // Identify index of the clicked message
  const idx = messages.findIndex((m) => m.id === message.id);

  // Determine what to keep and what to delete
  const isUserMsg = message.role === "user";
  
  const messagesToKeep = idx !== -1
    ? (isUserMsg ? messages.slice(0, idx + 1) : messages.slice(0, idx))
    : [];
  
  const messagesToDelete = idx !== -1
    ? (isUserMsg ? messages.slice(idx + 1) : messages.slice(idx))
    : [];

  const messageIdsToDelete = messagesToDelete.map((m) => m.id);

  const { execute, isExecuting } = useAction(deleteMessagesAction, {
    onSuccess: () => {
      // Truncate client state
      setMessages(messagesToKeep);
      // Trigger regenerate
      regenerate({ body: { model: modelId } });
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete subsequent messages");
    },
  });

  // If message not found, do not render button
  if (idx === -1) return null;

  const handleRegenerate = () => {
    if (messageIdsToDelete.length > 0) {
      execute({ conversationId, messageIds: messageIdsToDelete });
    } else {
      // No subsequent messages to delete, just trigger regeneration
      regenerate({ body: { model: modelId } });
    }
  };

  const handleClick = () => {
    if (messageIdsToDelete.length > 0) {
      setIsOpen(true);
    } else {
      handleRegenerate();
    }
  };

  // Block clicking during generation
  const isBlocked = status === "streaming" || status === "submitted" || isExecuting;

  return (
    <>
      <MessageAction
        tooltip="Regenerate response"
        onClick={handleClick}
        disabled={isBlocked}
        aria-label="Regenerate message"
      >
        <RefreshCw size={14} className={isExecuting ? "animate-spin" : ""} />
      </MessageAction>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate Response</DialogTitle>
            <DialogDescription>
              Are you sure you want to regenerate this response? Any subsequent messages in this conversation will be permanently deleted.
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
              onClick={handleRegenerate}
              disabled={isExecuting}
            >
              {isExecuting ? "Regenerating..." : "Regenerate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

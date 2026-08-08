"use client";

import { useState } from "react";
import { MessageAction } from "@/components/ai-elements/message";
import { useChatContext } from "@/features/chat/components/layout/ChatProvider";
import { RefreshCw } from "lucide-react";
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
  const messages = useChatContext((s) => s.messages);
  const setMessages = useChatContext((s) => s.setMessages);
  const regenerate = useChatContext((s) => s.regenerate);
  const modelId = useChatContext((s) => s.modelId);
  const status = useChatContext((s) => s.status);

  const [isOpen, setIsOpen] = useState(false);

  // Identify index of the clicked message
  const idx = messages.findIndex((m) => m.id === message.id);
  if (idx === -1) return null;

  // Determine what to keep on the client
  const isUserMsg = message.role === "user";
  const messagesToKeep = isUserMsg
    ? messages.slice(0, idx + 1)
    : messages.slice(0, idx);

  const willDiscardMessages = messagesToKeep.length < messages.length;

  const handleRegenerate = () => {
    if (willDiscardMessages) {
      setMessages(messagesToKeep);
    }
    regenerate({ body: { model: modelId } });
    setIsOpen(false);
  };

  // Block clicking during generation
  const isBlocked = status === "streaming" || status === "submitted";

  return (
    <>
      <MessageAction
        tooltip="Regenerate response"
        onClick={() => setIsOpen(true)}
        disabled={isBlocked}
        aria-label="Regenerate message"
      >
        <RefreshCw size={14} />
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
                <Button type="button" variant="outline" />
              }
            >
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleRegenerate}
            >
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

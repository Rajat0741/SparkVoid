"use client";

import { MessageActions as MessageActionsContainer } from "@/components/ai-elements/message";
import type { CustomUIMessage } from "@/types";
import { ClipboardButton } from "./ClipboardButton";
import { RegenerateButton } from "./RegenerateButton";

interface MessageActionsProps {
  message: CustomUIMessage;
  isStreaming?: boolean;
}

export default function MessageActions({
  message,
  isStreaming,
}: MessageActionsProps) {
  if (isStreaming) return null;

  return (
    <>
      <MessageActionsContainer
        className={`min-w-full ${message.role === "user" ? "justify-end" : "md:ml-6"}`}
      >
        <RegenerateButton message={message} />
        <ClipboardButton message={message} />
        {message.role === "assistant" && message.metadata?.model && (
          <span className="capitalize">
            &middot;{" "}
            {message.metadata.model}
          </span>
        )}
      </MessageActionsContainer>
    </>
  );
}

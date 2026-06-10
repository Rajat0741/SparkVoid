"use client";

import { MessageActions as MessageActionsContainer } from "@/components/ai-elements/message";
import type { CustomUIMessage } from "@/types";
import type { ChatStatus } from "ai";
import { ClipboardButton } from "./ClipboardButton";

interface MessageActionsProps {
  message: CustomUIMessage;
  status?: ChatStatus;
}

export default function MessageActions({
  message,
  status,
}: MessageActionsProps) {
  if (status !== "ready") return null;

  return (
    <MessageActionsContainer className={message.role === "user" ? "justify-end" : ""}>
      <ClipboardButton message={message} />
    </MessageActionsContainer>
  );
}

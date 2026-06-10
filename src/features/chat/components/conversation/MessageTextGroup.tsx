"use client";

import { isTextUIPart } from "ai";
import { MessageResponse } from "@/components/ai-elements/message";
import type { MessagePart } from "@/types";
import { AttachmentsMessage } from "./attachmentsMessage";

interface MessageTextGroupProps {
  parts: MessagePart[];
  groupKey: string;
}

export function MessageTextGroup({ parts, groupKey }: MessageTextGroupProps) {
  const textParts = parts.filter(isTextUIPart);

  return (
    <>
      <AttachmentsMessage parts={parts} groupKey={groupKey} />

      {textParts.map((part, i) => (
        <MessageResponse key={`${groupKey}-text-${i}`}>
          {part.text}
        </MessageResponse>
      ))}
    </>
  );
}

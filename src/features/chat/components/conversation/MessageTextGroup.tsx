"use client";

import { isTextUIPart } from "ai";
import { MessageResponse } from "@/components/ai-elements/message";
import type { MessagePart } from "@/types";

interface MessageTextGroupProps {
  parts: MessagePart[];
  groupKey: string;
}

export function MessageTextGroup({ parts, groupKey }: MessageTextGroupProps) {
  return (
    <>
      {parts.map((part, i) =>
        isTextUIPart(part) ? (
          <MessageResponse key={`${groupKey}-text-${i}`}>
            {part.text}
          </MessageResponse>
        ) : null
      )}
    </>
  );
}

"use client";

import { isReasoningUIPart, isToolUIPart, type ChatStatus } from "ai";
import {
  Message,
  MessageContent,
} from "@/components/ai-elements/message";
import ExtendedThinking from "./Extended-thinking";
import { MessageTextGroup } from "./MessageTextGroup";
import MessageActionsGroup from "./Message-Actions";
import type { CustomUIMessage, MessagePart } from "@/types";
import { Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Splits a flat parts array into consecutive groups of the same kind.
 *
 * Text parts act as boundaries — every time the LLM emits text mid-loop,
 * it closes the current step group and starts a new one after the text.
 *
 * Example (3 groups):
 * Input:  [reasoning, text-A, tool-search]
 * Output: [
 *   { type: "steps", parts: [reasoning] },
 *   { type: "text",  parts: [text-A] },
 *   { type: "steps", parts: [tool-search] },
 * ]
 */

interface PartGroup {
  type: "text" | "steps";
  parts: MessagePart[];
}

function groupParts(parts: MessagePart[]): PartGroup[] {
  const groups: PartGroup[] = [];
  let current: PartGroup | null = null;

  for (const part of parts) {
    if (part.type === "step-start") continue;

    const kind = isReasoningUIPart(part) || isToolUIPart(part) ? "steps" : "text";

    if (!current || current.type !== kind) {
      current = { type: kind, parts: [part] };
      groups.push(current);
    } else {
      current.parts.push(part);
    }
  }

  return groups;
}

// ---------------------------------------------------------------------------
// Sub-component
// ---------------------------------------------------------------------------

/**
 * Renders all groups belonging to a single chat message.
 *
 * Each group is either:
 *   - "steps" → ExtendedThinking panel (reasoning + tool calls)
 *   - "text"  → streamed markdown answer
 *
 * Step groups always go through ExtendedThinking regardless of how many
 * parts they contain — this keeps rendering consistent and avoids branching.
 */
function MessageItem({
  message,
  isStreaming,
}: {
  message: CustomUIMessage;
  isStreaming: boolean;
}) {
  const groups = groupParts(message.parts);
  return (
    <Message from={message.role} key={message.id}>
      
      <MessageContent>
        {groups.map((group, idx) =>
          group.type === "steps" ? (
            <ExtendedThinking
              key={`${message.id}-group-${idx}`}
              messageId={message.id}
              stepParts={group.parts}
              isStreaming={isStreaming && idx === groups.length - 1}
            />
          ) : (
            <MessageTextGroup
              key={`${message.id}-group-${idx}`}
              parts={group.parts}
              groupKey={`${message.id}-group-${idx}`}
            />
          )
        )}
      </MessageContent>
      
      <MessageActionsGroup message={message} isStreaming={isStreaming} />
    </Message>
  );
}

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------

interface MessageUIProps {
  messages: CustomUIMessage[];
  status?: ChatStatus;
}

/** Renders the full conversation message list. */
export default function MessageUI({ messages, status }: MessageUIProps) {
  return (
    <div className="[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
      {messages.map((message, idx) => {
        const isStreaming = status === "streaming" && idx === messages.length - 1;
        return (
          <MessageItem
            key={message.id}
            message={message}
            isStreaming={isStreaming}
          />
        );
      })}

      {/* Placeholder while waiting for assistant content */}
      {(
        status === "submitted" ||
        (status === "streaming" && !messages.at(-1)?.parts?.some(p => p.type !== "step-start"))
      ) && (
        <Message from="assistant">
          <MessageContent>
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          </MessageContent>
        </Message>
      )}
    </div>
  );
}

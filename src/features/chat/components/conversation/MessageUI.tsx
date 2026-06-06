"use client";

import { isReasoningUIPart, isToolUIPart } from "ai";
import { Message, MessageAction, MessageActions, MessageContent } from "@/components/ai-elements/message";
import ExtendedThinking from "./Extended-thinking";
import { MessageTextGroup } from "./MessageTextGroup";
import type { CustomUIMessage, MessagePart } from "@/types";
import { Check, Copy } from "lucide-react";
import { useState, useCallback } from "react";

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
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [message.parts]);

  return (
    <Message from={message.role} key={message.id}>
      <MessageContent>
        {groups.map((group, idx) => {
          const groupKey = `${message.id}-group-${idx}`;
          const isLastGroup = idx === groups.length - 1;

          if (group.type === "steps") {
            return (
              <ExtendedThinking
                key={groupKey}
                messageId={message.id}
                stepParts={group.parts}
                isStreaming={isStreaming && isLastGroup}
              />
            );
          }

          return (
            <MessageTextGroup
              key={groupKey}
              parts={group.parts}
              groupKey={groupKey}
            />
          );
        })}
      </MessageContent>
      <MessageActions className={message.role === "user" ? "justify-end" : ""}>
        <MessageAction
          tooltip={copied ? "Copied!" : "Copy"}
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy message"}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </MessageAction>
      </MessageActions>
    </Message>
  );
}

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------

interface MessageUIProps {
  messages: CustomUIMessage[];
  status?: string;
}

/** Renders the full conversation message list. */
export default function MessageUI({ messages, status }: MessageUIProps) {
  return (
    <>
      {messages.map((message, idx) => {
        
        const isStreaming = status === "streaming" && idx === messages.length - 1;
        return <MessageItem key={message.id} message={message} isStreaming={isStreaming} />;
      })}
    </>
  );
}

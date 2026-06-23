"use client";

import { isReasoningUIPart, isToolUIPart, type ChatStatus } from "ai";
import {
  Message,
  MessageContent,
} from "@/components/ai-elements/message";
import ExtendedThinking from "./Extended-thinking";
import { MessageTextGroup } from "./MessageTextGroup";
import MessageActionsGroup from "./Message-Actions";
import { MODEL_CONFIGS } from "@/features/chat/models/model-config";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ModelId } from "@/features/chat/validators";
import type { CustomUIMessage, MessagePart } from "@/types";

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
// Sub-components
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 h-6 px-1 text-muted-foreground mt-1 mb-1">
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
    </div>
  );
}

function ModelBadge({ modelKey }: { modelKey: ModelId }) {
  const config = MODEL_CONFIGS[modelKey];
  if (!config) return null;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<span />}>
          <div className="mt-0.5 shrink-0">{config.icon}</div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

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
      <div className="flex w-full items-start gap-2">
        {message.role === "assistant" && message.metadata?.model && (
          <ModelBadge modelKey={message.metadata.model} />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <MessageContent>
            {groups.length === 0 && isStreaming && message.role === "assistant" ? (
              <TypingIndicator />
            ) : (
              groups.map((group, idx) =>
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
              )
            )}
          </MessageContent>
          
          <MessageActionsGroup message={message} isStreaming={isStreaming} />
        </div>
      </div>
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
      {status === "submitted" && (
        <Message from="assistant">
          <MessageContent>
            <TypingIndicator />
          </MessageContent>
        </Message>
      )}
    </div>
  );
}

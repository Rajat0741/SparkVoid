"use client";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { UIDataTypes, UITools, UIMessage, DynamicToolUIPart } from "ai";
import { ToolInvocation } from "./ToolPart";

export default function MessageUI({
  messages,
}: {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
}) {
  return (
    <>
      {messages.map((message) => (
        <Message from={message.role} key={message.id}>
          <MessageContent>
            {message.parts.map((part, i) => {
              switch (part.type) {
                // Text response
                case "text":
                  return (
                    <MessageResponse key={`${message.id}-${i}`}>
                      {part.text}
                    </MessageResponse>
                  );
                // Reasoning
                case "reasoning":
                  return (
                    <Reasoning key={`${message.id}-${i}`}>
                      <ReasoningTrigger />
                      <ReasoningContent>{part.text}</ReasoningContent>
                    </Reasoning>
                  );
                default:
                  if (
                    typeof part.type === "string" &&
                    part.type.startsWith("tool-")
                  ) {
                    return (
                      <ToolInvocation
                        key={`${message.id}-${i}`}
                        messageId={message.id}
                        index={i}
                        part={part as unknown as DynamicToolUIPart}
                      />
                    );
                  }
                  return null;
              }
            })}
          </MessageContent>
        </Message>
      ))}
    </>
  );
}

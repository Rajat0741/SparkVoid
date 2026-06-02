"use client";

import type { DynamicToolUIPart } from "ai";

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

type ToolInvocationProps = {
  messageId: string;
  index: number;
  part: DynamicToolUIPart;
};

export function ToolInvocation({
  messageId,
  index,
  part,
}: ToolInvocationProps) {
  const key = `${messageId}-${index}`;

  return (
    <Tool key={key}>
      <ToolHeader
        type={part.type}
        state={part.state}
        title={part.title}
        toolName={part.toolName}
      />
      <ToolContent>
        <ToolInput input={part.input} />
        {(part.state === "output-available" ||
          part.state === "output-error") && (
          <ToolOutput output={part.output} errorText={part.errorText} />
        )}
      </ToolContent>
    </Tool>
  );
}

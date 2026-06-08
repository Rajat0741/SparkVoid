"use client";

import { WrenchIcon } from "lucide-react";
import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import { ToolInput } from "@/components/ai-elements/tool";
import type { ToolPart, StepStatus } from "./helpers";

interface GenericToolStepProps {
  part: ToolPart;
  status: StepStatus;
}

/**
 * Renders any tool call that is not a search tool.
 * Shows the tool name, its input parameters, and the output/error once done.
 */
export function GenericToolStep({ part, status }: GenericToolStepProps) {
  // Prefer an explicit title, fall back to the tool name, then the type string
  const label =
    ("title" in part && part.title) ||
    ("toolName" in part ? part.toolName : part.type.replace("tool-", "")) ||
    "Tool";

  return (
    <ChainOfThoughtStep icon={WrenchIcon} label={label} status={status}>
      <div className="rounded-lg border border-border/40 bg-muted/10 p-2 mt-2">
        <ToolInput input={part.input} />
      </div>
    </ChainOfThoughtStep>
  );
}

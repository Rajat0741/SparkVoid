"use client";

import { WrenchIcon } from "lucide-react";
import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import { ToolInput } from "@/components/ai-elements/tool";
import type { ToolPart, StepStatus } from "./helpers";
import { resolveStatusIcon } from "./step-icons";

interface GenericToolStepProps {
  part: ToolPart;
  status: StepStatus;
}

export function GenericToolStep({ part, status }: GenericToolStepProps) {
  const label =
    ("title" in part && part.title) ||
    ("toolName" in part ? part.toolName : part.type.replace("tool-", "")) ||
    "Tool";

  const isError = part.state === "output-error" || !!part.errorText;

  return (
    <ChainOfThoughtStep
      icon={<WrenchIcon className="size-4" />}
      statusIcon={resolveStatusIcon(status, isError)}
      label={label}
      status={status}
    >
      <div className="rounded-lg border border-border/40 bg-muted/10 p-2 mt-2">
        <ToolInput input={part.input} />
      </div>
    </ChainOfThoughtStep>
  );
}

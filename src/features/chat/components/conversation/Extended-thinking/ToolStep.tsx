"use client";

import type { ReactNode } from "react";
import { CircleCheckBig, CircleX, LoaderPinwheel } from "lucide-react";
import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import { TOOL_CONFIGS } from "./tool-configs";
import type { ToolPart, StepStatus } from "./helpers";

interface ToolStepProps {
  part: ToolPart;
  status: StepStatus;
}

function resolveStatusIcon(status: StepStatus, isError: boolean): ReactNode {
  if (status === "active") return <LoaderPinwheel className="size-4 animate-spin" />;
  if (isError) return <CircleX className="size-4 text-red-500" />;
  return <CircleCheckBig className="size-4 text-green-500" />;
}

export function ToolStep({ part, status }: ToolStepProps) {
  const isError = part.state === "output-error" || !!part.errorText;
  const isRunning = status === "active";
  const toolName = "toolName" in part ? part.toolName : part.type;
  const config = TOOL_CONFIGS.find((c) => toolName.toLowerCase().includes(c.key))!;

  const label = isRunning ? config.runningTitle : config.completedTitle;
  const input = part.input as Record<string, string> | null | undefined;
  const query = config.queryKey ? input?.[config.queryKey] : undefined;
  const statusIcon = resolveStatusIcon(status, isError);

  return (
    <ChainOfThoughtStep
      icon={config.icon}
      statusIcon={statusIcon}
      label={
        <span className="flex items-center gap-1.5 min-w-0 truncate">
          <span>{label}</span>
          {query && (
            <span className="text-muted-foreground truncate">&quot;{query}&quot;</span>
          )}
        </span>
      }
      status={status}
    />
  );
}

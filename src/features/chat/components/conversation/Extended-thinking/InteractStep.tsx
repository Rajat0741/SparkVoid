"use client";

import { MousePointerClick } from "lucide-react";
import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import type { ToolPart, StepStatus } from "./helpers";
import { interact } from "firecrawl-aisdk";

interface InteractStepProps {
  part: ToolPart;
  status: StepStatus;
}

export type InteractTool = ReturnType<typeof interact>;

/**
 * Renders a browser interaction step showing only the target URL/session.
 */
export function InteractStep({ part, status }: InteractStepProps) {
  const input = part.input as Parameters<NonNullable<InteractTool["execute"]>>[0] | null | undefined;
  const url = input?.url || "browser session";

  const errorText = part.errorText;

  let descriptionLabel = "Executing actions...";
  if (errorText || part.state === "output-error") {
    descriptionLabel = "Interaction failed";
  } else if (part.state === "output-available") {
    descriptionLabel = "Interaction completed";
  }

  return (
    <ChainOfThoughtStep
      icon={MousePointerClick}
      label={`Interacting with ${url}`}
      status={status}
      description={descriptionLabel}
    />
  );
}

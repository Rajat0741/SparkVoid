"use client";

import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import type { ReasoningUIPart, StepStatus } from "./helpers";
import { MessageResponse } from "@/components/ai-elements/message";
import { CircleDot } from "lucide-react";

interface ReasoningStepProps {
  part: ReasoningUIPart;
  status: StepStatus;
}

/** Renders the model's raw thinking text inside a collapsible step row. */
export function ReasoningStep({ part, status }: ReasoningStepProps) {
  return (
    <ChainOfThoughtStep label={null} icon={<CircleDot className="size-4" />} status={status}>
      {part.text && <MessageResponse>{part.text}</MessageResponse>}
    </ChainOfThoughtStep>
  );
}

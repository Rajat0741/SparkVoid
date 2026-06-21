"use client";

import { Search } from "lucide-react";
import { tavilySearch } from "@tavily/ai-sdk";
import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import type { ToolPart, StepStatus } from "./helpers";
import { resolveStatusIcon } from "./step-icons";

type TavilyInput = Parameters<NonNullable<ReturnType<typeof tavilySearch>["execute"]>>[0];

interface TavilyStepProps {
  part: ToolPart;
  status: StepStatus;
}

export function TavilyStep({ part, status }: TavilyStepProps) {
  const input = part.input as TavilyInput | null | undefined;
  const query = input?.query ?? "Searching the web";
  const isError = part.state === "output-error" || !!part.errorText;

  return (
    <ChainOfThoughtStep
      icon={<Search className="size-4" />}
      statusIcon={resolveStatusIcon(status, isError)}
      label={`Searching "${query}"`}
      status={status}
    />
  );
}

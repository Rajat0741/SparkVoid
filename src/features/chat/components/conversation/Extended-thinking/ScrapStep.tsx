"use client";

import { Link2Icon } from "lucide-react";
import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import type { ToolPart, StepStatus } from "./helpers";
import { resolveStatusIcon } from "./step-icons";
import { scrape } from "firecrawl-aisdk";

interface ScrapStepProps {
  part: ToolPart;
  status: StepStatus;
}

export type ScrapeTool = ReturnType<typeof scrape>;

export function ScrapStep({ part, status }: ScrapStepProps) {
  const input = part.input as Parameters<NonNullable<ScrapeTool["execute"]>>[0] | null | undefined;
  const url = input?.url || "Scraping page";
  const isError = part.state === "output-error" || !!part.errorText;

  return (
    <ChainOfThoughtStep
      icon={<Link2Icon className="size-4" />}
      statusIcon={resolveStatusIcon(status, isError)}
      label={`Scraping ${url}`}
      status={status}
    />
  );
}

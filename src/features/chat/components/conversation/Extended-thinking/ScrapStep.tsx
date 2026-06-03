"use client";

import { Link2Icon } from "lucide-react";
import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import type { ToolPart, StepStatus } from "./helpers";
import { scrape } from "firecrawl-aisdk";

interface ScrapStepProps {
  part: ToolPart;
  status: StepStatus;
}

export type ScrapeTool = ReturnType<typeof scrape>;

/**
 * Renders a web page scraping step showing only the target URL.
 */
export function ScrapStep({ part, status }: ScrapStepProps) {
  const input = part.input as Parameters<NonNullable<ScrapeTool["execute"]>>[0] | null | undefined;
  const url = input?.url || "Scraping page";

  const errorText = part.errorText;

  let descriptionLabel = "Reading page content...";
  if (errorText || part.state === "output-error") {
    descriptionLabel = "Scraping failed";
  } else if (part.state === "output-available") {
    descriptionLabel = "Scraped successfully";
  }

  return (
    <ChainOfThoughtStep
      icon={Link2Icon}
      label={`Scraping ${url}`}
      status={status}
      description={descriptionLabel}
    />
  );
}

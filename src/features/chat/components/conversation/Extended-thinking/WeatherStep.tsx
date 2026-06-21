"use client";

import { CloudSun } from "lucide-react";
import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import { weatherTool } from "@/lib/tools/get-weather";
import type { ToolPart, StepStatus } from "./helpers";
import { resolveStatusIcon } from "./step-icons";

type WeatherInput = Parameters<NonNullable<typeof weatherTool["execute"]>>[0];

interface WeatherStepProps {
  part: ToolPart;
  status: StepStatus;
}

export function WeatherStep({ part, status }: WeatherStepProps) {
  const input = part.input as WeatherInput | null | undefined;
  const location = input?.location ?? "Getting weather";
  const isError = part.state === "output-error" || !!part.errorText;

  return (
    <ChainOfThoughtStep
      icon={<CloudSun className="size-4" />}
      statusIcon={resolveStatusIcon(status, isError)}
      label={<span className="truncate">{location}</span>}
      status={status}
    />
  );
}

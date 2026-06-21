import type { ReactNode } from "react";
import { CircleCheckBig, CircleX, LoaderPinwheel } from "lucide-react";
import type { StepStatus } from "./helpers";

/**
 * Returns the appropriate status icon for a tool step.
 * Centralises the LoaderPinwheel / CircleX / CircleCheckBig pattern so
 * individual step components don't duplicate it.
 */
export function resolveStatusIcon(status: StepStatus, isError: boolean): ReactNode {
  if (status === "active") return <LoaderPinwheel className="size-4 animate-spin" />;
  if (isError) return <CircleX className="size-4 text-red-500" />;
  return <CircleCheckBig className="size-4 text-green-500" />;
}

import type { ToolUIPart, DynamicToolUIPart } from "ai";
import { isReasoningUIPart, isToolUIPart } from "ai";
import type { MessagePart } from "@/types";
import type { SearchParams } from "firecrawl-aisdk";

// Re-export the union type used across all step components
export type ToolPart = ToolUIPart | DynamicToolUIPart;

export type StepStatus = "active" | "complete";

// Mirrors SearchResultWeb from @mendable/firecrawl-js.
// SearchData["web"] is not re-exported by firecrawl-aisdk, so we define this explicitly.
export interface SearchResult {
  url: string;
  title?: string;
  description?: string;
}

export type { SearchParams };

import { TOOL_CONFIGS } from "./tool-configs";

// ---------------------------------------------------------------------------
// resolveTitle
// ---------------------------------------------------------------------------

/**
 * Picks the header label for the chain-of-thought panel based on what the
 * steps are currently doing. Priority: search active > search done > tool
 * active > tool done > streaming (pure reasoning) > idle.
 */
export function resolveTitle(
  stepParts: MessagePart[],
  isStreaming: boolean,
): string {
  const toolParts = stepParts.filter(isToolUIPart);

  const isRunning = (p: ToolPart) =>
    p.state !== "output-available" && p.state !== "output-error";

  const getToolConfig = (p: ToolPart) => {
    const name = ("toolName" in p ? p.toolName : p.type).toLowerCase();
    return TOOL_CONFIGS.find((c) => name.includes(c.key));
  };

  // Find if there's any active tool currently running that is in our config
  for (const part of toolParts) {
    if (isRunning(part)) {
      const config = getToolConfig(part);
      if (config) {
        return config.runningTitle;
      }
    }
  }

  // Find if there's any completed tool in our config
  for (const part of toolParts) {
    const config = getToolConfig(part);
    if (config) {
      return config.completedTitle;
    }
  }

  if (toolParts.some(isRunning)) return "Running tools...";
  if (toolParts.length > 0) return "Used tools";
  if (isStreaming) return "Thinking...";
  return "Thinking";
}

// ---------------------------------------------------------------------------
// allStepsComplete
// ---------------------------------------------------------------------------

/**
 * Returns true when every step part has fully finished and the message is no
 * longer streaming. Used to show the "Done" marker at the end of the chain.
 */
export function allStepsComplete(
  stepParts: MessagePart[],
  isStreaming: boolean,
): boolean {
  if (isStreaming) return false;

  return stepParts.every((p) => {
    if (isReasoningUIPart(p)) return true;
    if (isToolUIPart(p))
      return p.state === "output-available" || p.state === "output-error";
    return false;
  });
}

import type { ToolUIPart, DynamicToolUIPart, ReasoningUIPart } from "ai";
import { isReasoningUIPart, isToolUIPart } from "ai";
import type { MessagePart } from "@/types";

// Re-export the union type used across all step components
export type ToolPart = ToolUIPart | DynamicToolUIPart;

export type StepStatus = "active" | "complete";

export interface SearchResult {
  url?: string;
  link?: string;
  title?: string;
}

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

  const isSearchTool = (p: ToolPart) => {
    const name = "toolName" in p ? p.toolName : p.type;
    return name.includes("search");
  };

  const isScrapTool = (p: ToolPart) => {
    const name = "toolName" in p ? p.toolName : p.type;
    return name.includes("scrap") || name.includes("scrape");
  };

  const isInteractTool = (p: ToolPart) => {
    const name = "toolName" in p ? p.toolName : p.type;
    return name.includes("interact");
  };

  if (toolParts.some((p) => isSearchTool(p) && isRunning(p)))
    return "Searching the web...";
  if (toolParts.some((p) => isScrapTool(p) && isRunning(p)))
    return "Reading web page...";
  if (toolParts.some((p) => isInteractTool(p) && isRunning(p)))
    return "Interacting with Website...";
  if (toolParts.some(isSearchTool)) return "Searched the web";
  if (toolParts.some(isScrapTool)) return "Scraped a website";
  if (toolParts.some(isInteractTool)) return "Interacted with Website";
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

// Re-export guards so step components don't need to import from "ai" directly
export { isReasoningUIPart, isToolUIPart };
export type { ReasoningUIPart, MessagePart };

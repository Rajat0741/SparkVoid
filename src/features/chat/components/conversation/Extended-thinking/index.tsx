"use client";

import { CheckCircleIcon } from "lucide-react";
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import { ReasoningStep } from "./ReasoningStep";
import { SearchStep } from "./SearchStep";
import { ScrapStep } from "./ScrapStep";
import { InteractStep } from "./InteractStep";
import { GenericToolStep } from "./GenericToolStep";
import { resolveTitle, allStepsComplete } from "./helpers";
import { isReasoningUIPart, isToolUIPart } from "./helpers";
import type { MessagePart } from "./helpers";
import { useEffect, useState } from "react";

interface ExtendedThinkingProps {
  messageId: string;
  stepParts: MessagePart[];
  isStreaming: boolean;
}

/**
 * Collapsible chain-of-thought panel. Shown when a single AI message has
 * more than one step part (e.g. reasoning → web search → answer).
 *
 * Each step is delegated to a focused sub-component:
 *   - ReasoningStep  — model's raw thinking text
 *   - SearchStep     — web search query + result links
 *   - GenericToolStep — any other tool call
 */
const getToolType = (name: string) => {
  if (name.includes("search")) return "search";
  if (name.includes("scrap") || name.includes("scrape")) return "scrape";
  if (name.includes("interact")) return "interact";
  return "generic";
};

export default function ExtendedThinking({
  messageId,
  stepParts,
  isStreaming,
}: ExtendedThinkingProps) {
  const title = resolveTitle(stepParts, isStreaming);
  const isDone = allStepsComplete(stepParts, isStreaming);
  const [isOpen, setIsOpen] = useState(isStreaming);

  useEffect(() => {
    if (isStreaming) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    } else if (isDone) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isStreaming, isDone]);

  return (
    // Open by default while streaming so the user can follow along live
    <ChainOfThought open={isOpen} onOpenChange={setIsOpen}>
      <ChainOfThoughtHeader>{title}</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {stepParts.map((part, index) => {
          const key = `${messageId}-step-${index}`;
          const isLast = index === stepParts.length - 1;

          if (isReasoningUIPart(part)) {
            const status = isStreaming && isLast ? "active" : "complete";
            return <ReasoningStep key={key} part={part} status={status} />;
          }

          if (isToolUIPart(part)) {
            const isRunning = part.state !== "output-available" && part.state !== "output-error";
            const status = isRunning ? "active" : "complete";
            const toolName = "toolName" in part ? part.toolName : part.type;

            switch (getToolType(toolName)) {
              case "search":
                return <SearchStep key={key} part={part} status={status} />;
              case "scrape":
                return <ScrapStep key={key} part={part} status={status} />;
              case "interact":
                return <InteractStep key={key} part={part} status={status} />;
              default:
                return <GenericToolStep key={key} part={part} status={status} />
            }
          }

          return null;
        })}

        {/* "Done" row appears once every step has finished */}
        {isDone && (
          <ChainOfThoughtStep
            icon={CheckCircleIcon}
            label={
              <span className="font-medium text-muted-foreground">Done</span>
            }
            status="complete"
          />
        )}
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

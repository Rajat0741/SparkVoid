"use client";

import { GlobeIcon } from "lucide-react";
import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import type { ToolPart, StepStatus, SearchResult } from "./helpers";

// ---------------------------------------------------------------------------
// ResultLink — one clickable row inside the results list
// ---------------------------------------------------------------------------

function ResultLink({ result }: { result: SearchResult }) {
  const url = result.url || result.link || "";
  let hostname = "";
  try {
    if (url) hostname = new URL(url).hostname.replace("www.", "");
  } catch {
    // URL is malformed — hostname stays empty, link still renders
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/40 hover:text-foreground transition-all duration-150 text-xs text-muted-foreground/90 border border-transparent hover:border-border/30"
    >
      <div className="flex items-center gap-2 min-w-0">
        <GlobeIcon className="size-3.5 text-muted-foreground/60 shrink-0" />
        <span className="font-medium truncate">{result.title || url}</span>
      </div>
      {hostname && (
        <span className="text-[10px] text-muted-foreground/75 ml-2 shrink-0 font-mono">
          {hostname}
        </span>
      )}
    </a>
  );
}

// ---------------------------------------------------------------------------
// ResultList — scrollable list of search result links
// ---------------------------------------------------------------------------

function ResultList({ results }: { results: SearchResult[] }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border/50 bg-muted/15 p-2 max-h-48 overflow-y-auto mt-2 shadow-inner">
      {results.map((result, idx) => (
        <ResultLink key={idx} result={result} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchStep — the main export
// ---------------------------------------------------------------------------

interface SearchStepProps {
  part: ToolPart;
  status: StepStatus;
}

/** Renders a web-search tool step with the query label and result links. */
export function SearchStep({ part, status }: SearchStepProps) {
  // Safely pull the query string out of the tool input object
  const inputObj = part.input as Record<string, unknown> | null | undefined;
  const query =
    inputObj && "query" in inputObj ? String(inputObj.query) : "Searching the web";

  // Safely pull the results array out of the tool output object
  const outputObj = part.output as Record<string, unknown> | null | undefined;
  const results: SearchResult[] =
    outputObj && Array.isArray(outputObj.web)
      ? (outputObj.web as SearchResult[])
      : [];

  const resultCount =
    part.state === "output-available" && results.length > 0
      ? `${results.length} results`
      : undefined;

  return (
    <ChainOfThoughtStep
      icon={GlobeIcon}
      label={query}
      status={status}
      description={resultCount}
    >
      {part.state === "output-available" && results.length > 0 && (
        <ResultList results={results} />
      )}
    </ChainOfThoughtStep>
  );
}

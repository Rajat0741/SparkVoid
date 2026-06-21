"use client";

import { useState } from "react";
import { GlobeIcon } from "lucide-react";
import { ChainOfThoughtStep } from "@/components/ai-elements/chain-of-thought";
import type { ToolPart, StepStatus, SearchResult, SearchParams } from "./helpers";
import { resolveStatusIcon } from "./step-icons";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ResultLink({ result }: { result: SearchResult }) {
  const url = result.url;
  const hostname = parseHostname(url);
  const [imgError, setImgError] = useState(false);

  const showFavicon = !imgError && hostname;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/40 hover:text-foreground transition-all duration-150 text-xs text-muted-foreground/90 border border-transparent hover:border-border/30"
    >
      <div className="flex items-center gap-2 min-w-0">
        {showFavicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
            alt=""
            width={16}
            height={16}
            className="size-4 shrink-0 rounded-sm"
            onError={() => setImgError(true)}
          />
        ) : (
          <GlobeIcon className="size-3.5 text-muted-foreground/60 shrink-0" />
        )}
        <span className="font-medium truncate">{result.title || url}</span>
      </div>

      {hostname && (
        <span className="text-[10px] text-muted-foreground/80 ml-2 shrink-0 font-mono">
          {hostname}
        </span>
      )}
    </a>
  );
}

function ResultList({ results }: { results: SearchResult[] }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border/50 bg-muted/80 p-2 max-h-48 overflow-y-auto mt-2">
      {results.map((result, idx) => (
        <ResultLink key={result.url ?? idx} result={result} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchStep
// ---------------------------------------------------------------------------

interface SearchStepProps {
  part: ToolPart;
  status: StepStatus;
}

export function SearchStep({ part, status }: SearchStepProps) {
  const input = part.input as SearchParams | null | undefined;
  const query = input?.query ?? "Searching the web";

  const output = part.output as { web?: SearchResult[] } | null | undefined;
  const results: SearchResult[] = Array.isArray(output?.web) ? output.web : [];

  const isError = part.state === "output-error" || !!part.errorText;
  const statusIcon = resolveStatusIcon(status, isError);

  return (
    <ChainOfThoughtStep
      icon={<GlobeIcon className="size-4" />}
      statusIcon={statusIcon}
      label={query}
      status={status}
    >
      {part.state === "output-available" && results.length > 0 && (
        <ResultList results={results} />
      )}
    </ChainOfThoughtStep>
  );
}

"use client";

import { AlertCircle } from "lucide-react";

interface GenerationErrorProps {
  error: Error;
}

export function GenerationError({ error }: GenerationErrorProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
      <AlertCircle className="size-5 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        <p className="font-semibold">Generation Failed</p>
        <p className="text-destructive/90 text-xs">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>
    </div>
  );
}

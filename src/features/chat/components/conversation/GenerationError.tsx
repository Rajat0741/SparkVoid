"use client";

import { AlertCircle, X } from "lucide-react";

interface GenerationErrorProps {
  error: Error;
  onDismiss?: () => void;
}

export function GenerationError({ error, onDismiss }: GenerationErrorProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
      <AlertCircle className="size-5 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        <p className="font-semibold">Generation Failed</p>
        <p className="text-destructive/90 text-xs">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="shrink-0 rounded p-0.5 hover:bg-destructive/20 transition-colors"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

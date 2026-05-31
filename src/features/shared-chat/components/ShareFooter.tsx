"use client";

import { Share2, LogIn, BookmarkPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareFooterProps {
  isAuthenticated: boolean;
  isImporting: boolean;
  onSignIn: () => void;
  onImport: () => void;
}

export function ShareFooter({
  isAuthenticated,
  isImporting,
  onSignIn,
  onImport,
}: ShareFooterProps) {
  return (
    <footer className="sticky bottom-0 border-t bg-background/80 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Share2 className="h-3.5 w-3.5 shrink-0" />
          <span>Shared via SparkVoid AI</span>
        </div>

        {isAuthenticated ? (
          <Button size="sm" onClick={onImport} disabled={isImporting}>
            {isImporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BookmarkPlus className="mr-2 h-4 w-4" />
            )}
            {isImporting ? "Importing..." : "Import to my chats"}
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={onSignIn}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign in to import
          </Button>
        )}
      </div>
    </footer>
  );
}

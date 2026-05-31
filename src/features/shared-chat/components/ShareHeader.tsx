"use client";

import Link from "next/link";
import { LogIn, BookmarkPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareHeaderProps {
  title: string;
  isAuthenticated: boolean;
  isImporting: boolean;
  onSignIn: () => void;
  onImport: () => void;
}

export function ShareHeader({
  title,
  isAuthenticated,
  isImporting,
  onSignIn,
  onImport,
}: ShareHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-background/80 px-4 py-3 backdrop-blur-sm">
      <Link
        href="/"
        className="shrink-0 font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        SparkVoid AI
      </Link>

      <p className="flex-1 truncate text-center text-sm font-medium text-muted-foreground">
        {title}
      </p>

      {isAuthenticated ? (
        <Button
          size="sm"
          onClick={onImport}
          disabled={isImporting}
          className="shrink-0"
        >
          {isImporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BookmarkPlus className="mr-2 h-4 w-4" />
          )}
          {isImporting ? "Importing..." : "Import"}
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={onSignIn} className="shrink-0">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      )}
    </header>
  );
}

"use client";

import {
  useSidebar,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SidebarHeaderBrand() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarHeader>
      <div className="flex h-12 items-center justify-between px-2 w-full group/brand relative">
        {/* Brand logo and title */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 outline-none select-none transition-all duration-200",
            isCollapsed
              ? "opacity-100 group-hover/brand:opacity-0 pointer-events-auto justify-center w-full"
              : "opacity-100 pointer-events-auto",
          )}
        >
          <Sparkles className="size-5 shrink-0 text-amber-500 animate-pulse" />
          {!isCollapsed && (
            <span className="font-bold tracking-tight text-foreground text-base font-sans">
              SparkVoid
            </span>
          )}
        </Link>

        {/* Trigger button */}
        <div
          className={cn(
            "transition-all duration-200",
            isCollapsed
              ? "absolute inset-0 flex items-center justify-center opacity-0 group-hover/brand:opacity-100 pointer-events-none group-hover/brand:pointer-events-auto"
              : "ml-auto",
          )}
        >
          <SidebarTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md size-8" />
        </div>
      </div>
    </SidebarHeader>
  );
}

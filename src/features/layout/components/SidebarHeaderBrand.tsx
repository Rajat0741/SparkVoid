"use client";

import {
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function SidebarHeaderBrand() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-12 items-center gap-2 px-2 group-data-[collapsible=icon]:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="size-5 shrink-0 text-amber-500" />
            <span className="font-semibold tracking-tight truncate">
              SparkVoid
            </span>
          </Link>
          <SidebarTrigger className="ml-auto size-8" />
        </div>

        <div className="hidden group-data-[collapsible=icon]:grid h-12 place-items-center group/brand">
          <Link
            href={isCollapsed ? "#" : "/"}
            onClick={(e) => {
              if (isCollapsed) e.preventDefault();
            }}
            className="col-start-1 row-start-1 transition-opacity group-hover/brand:opacity-0 group-hover/brand:pointer-events-none"
            aria-hidden={isCollapsed}
            tabIndex={isCollapsed ? -1 : 0}
          >
            <Sparkles className="size-5 text-amber-500" />
          </Link>

          <SidebarTrigger className="col-start-1 row-start-1 size-8 opacity-0 transition-opacity group-hover/brand:opacity-100" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

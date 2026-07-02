"use client";

import {
  SidebarTrigger,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export function SidebarHeaderBrand() {
  const { state } = useSidebar();

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="group-data-[collapsible=icon]:w-full">
          <div className="flex h-12 px-2 gap-2 group-data-[collapsible=icon]:hidden">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <Sparkles className="size-5 shrink-0 text-amber-500" />
              <span className="font-semibold tracking-tight truncate">
                SparkVoid
              </span>
            </Link>
            <SidebarTrigger className="ml-auto size-8" />
          </div>

          <div className="hidden group-data-[collapsible=icon]:flex relative h-12 w-full items-center justify-center group/brand">
            <Link
              href={state === "collapsed" ? "#" : "/"}
              onClick={(e) => {
                if (state === "collapsed") e.preventDefault();
              }}
              className="absolute inset-0 flex items-center justify-center transition-opacity group-hover/brand:opacity-0"
              aria-hidden={state === "collapsed"}
              tabIndex={state === "collapsed" ? -1 : 0}
            >
              <Sparkles className="size-5 text-amber-500" />
            </Link>

            <SidebarTrigger className="absolute inset-0 m-auto size-8 opacity-0 transition-opacity group-hover/brand:opacity-100" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

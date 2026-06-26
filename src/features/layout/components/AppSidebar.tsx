"use client";

import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { SidebarMenuActions } from "./SidebarMenuActions";
import { SidebarConversations } from "./conversations/SidebarConversations";
import { SidebarUserFooter } from "./SidebarUserFooter";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

function SidebarBrand() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarHeader>
      <div className="flex h-12 items-center justify-between px-2 w-full group/brand relative">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 outline-none select-none transition-all duration-200",
            isCollapsed ? "group-hover/brand:opacity-0 justify-center w-full" : "",
          )}
        >
          <Sparkles className="size-5 shrink-0 text-amber-500 animate-pulse" />
          {!isCollapsed && (
            <span className="font-bold tracking-tight text-foreground text-base">
              SparkVoid
            </span>
          )}
        </Link>
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

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarBrand />
      <SidebarContent className="flex flex-col min-h-0 justify-between">
        <div className="flex flex-col min-h-0 w-full">
          <SidebarMenuActions />
          <SidebarConversations />
        </div>
      </SidebarContent>
      <SidebarUserFooter user={user} />
    </Sidebar>
  );
}

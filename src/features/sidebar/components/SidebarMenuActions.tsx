"use client";

import { SquarePen, BookSearch } from "lucide-react";
import Link from "next/link";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemGroup } from "@/components/ui/item";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";

const actionItems = [
  { title: "New chat", url: "/chat", icon: SquarePen },
  { title: "Chats", url: "/search", icon: BookSearch },
];

export function SidebarMenuActions() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <ItemGroup className="px-2 py-2 gap-1">
      {actionItems.map((item) => {
        const itemComp = (
          <Item
            key={item.title}
            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-all duration-200 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center"
            render={<Link href={item.url} />}
          >
            <ItemMedia variant="icon" className="group-data-[collapsible=icon]:m-0">
              <item.icon className="size-4 shrink-0" />
            </ItemMedia>
            <ItemContent className="group-data-[collapsible=icon]:hidden">
              <ItemTitle className="text-sm font-sans">{item.title}</ItemTitle>
            </ItemContent>
          </Item>
        );

        if (isCollapsed && !isMobile) {
          return (
            <Tooltip key={item.title}>
              <TooltipTrigger>
                {itemComp}
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                {item.title}
              </TooltipContent>
            </Tooltip>
          );
        }

        return itemComp;
      })}
    </ItemGroup>
  );
}

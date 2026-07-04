"use client";

import { SquarePen, BookSearch } from "lucide-react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const actionItems = [
  { title: "New chat", url: "/chat", icon: SquarePen },
  { title: "Chats", url: "/search", icon: BookSearch },
];

export function SidebarMenuActions() {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className="pt-0">
      <SidebarMenu className="gap-2">
        {actionItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              render={
                <Link
                  href={item.url}
                  onClick={() => isMobile && setOpenMobile(false)}
                  className="[&_svg]:size-4.5 text-sidebar-foreground"
                />
              }
            >
              <item.icon className="group-hover/menu-button:text-muted-foreground transition-colors" />
              <span className="text-base group-hover/menu-button:text-muted-foreground transition-colors">
                {item.title}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

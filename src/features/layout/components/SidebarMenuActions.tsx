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
    <SidebarGroup>
      <SidebarMenu>
        {actionItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              render={
                <Link
                  href={item.url}
                  onClick={() => isMobile && setOpenMobile(false)}
                />
              }
            >
              <item.icon/>
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

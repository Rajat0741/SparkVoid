"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SidebarHeaderBrand } from "./SidebarHeaderBrand";
import { SidebarMenuActions } from "./SidebarMenuActions";
import { SidebarConversations } from "./conversations/SidebarConversations";
import { SidebarUserFooter } from "./SidebarUserFooter";

interface AppSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderBrand />
      <SidebarContent>
        <SidebarMenuActions />
        <SidebarConversations />
      </SidebarContent>
      <SidebarUserFooter user={user} />
    </Sidebar>
  );
}

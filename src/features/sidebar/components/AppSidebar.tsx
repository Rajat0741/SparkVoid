import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
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
      <SidebarHeader>
        <SidebarHeaderBrand />
      </SidebarHeader>
      <SidebarContent className="flex flex-col min-h-0 justify-between">
        <div className="flex flex-col min-h-0 w-full">
          <SidebarMenuActions />
          <SidebarConversations />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarUserFooter user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

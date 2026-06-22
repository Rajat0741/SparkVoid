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

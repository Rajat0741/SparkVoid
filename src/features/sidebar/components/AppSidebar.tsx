import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarHeaderBrand } from "./SidebarHeaderBrand";
import { SidebarMenuActions } from "./SidebarMenuActions";
import { SidebarConversations } from "./SidebarConversations";
import { SidebarUserFooter } from "./SidebarUserFooter";
import { ConversationType } from "@/lib/db/schema";

interface AppSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  conversations: ConversationType[];
}

export function AppSidebar({ user, conversations }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarHeaderBrand />
      </SidebarHeader>
      <SidebarContent className="flex flex-col min-h-0 justify-between">
        <div className="flex flex-col min-h-0 w-full">
          <SidebarMenuActions />
          <SidebarConversations conversations={conversations} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserFooter user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

import { getUserSession } from "@/lib/getUser";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/layout/components/AppSidebar";
import { AppHeader } from "@/features/layout/components/AppHeader";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function ChatLayout({ children }: { children: React.ReactNode }){
  let session = null;
  try {
    const sessionHeaders = await headers();
    session = await getUserSession(sessionHeaders);
  } catch {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar user={session.user} />
        <SidebarInset className="flex flex-col h-dvh overflow-hidden">
          <AppHeader />
          {children}
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}

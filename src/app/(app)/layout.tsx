import { getUserSession } from "@/lib/getUser";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/sidebar/components/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function ChatLayout({ children }: { children: React.ReactNode }){
  let session = null;
  try {
    const sessionHeaders = await headers();
    session = await getUserSession(sessionHeaders);
  } catch {
    redirect("/login");
  }

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar user={session.user} />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          {children}
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}

import { getUserSession } from "@/lib/getUser";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/layout/components/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
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
        <SidebarInset className="relative h-dvh overflow-hidden">
          <div className="absolute top-4 left-4 z-10 p-0.5 backdrop-blur-xl border-2 rounded-xl md:hidden">
            <SidebarTrigger iconClassName="size-5" />
          </div>
          {children}
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}

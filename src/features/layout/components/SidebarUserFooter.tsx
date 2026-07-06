"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { LogOut, ChevronUp, Settings, Bug, Loader2 } from "lucide-react";
import { logoutAction } from "@/features/auth/actions/logout-action";
import { SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserFooterProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export function SidebarUserFooter({ user }: UserFooterProps) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const isCollapsed = state === "collapsed";

  const { execute: handleLogout, isExecuting: isLoggingOut } = useAction(logoutAction);

  return (
    <SidebarFooter className="border-t">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              className={cn(
                "flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 outline-none cursor-pointer",
                isCollapsed && "justify-center p-1",
              )}
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={24}
                  height={24}
                  className="rounded-full shrink-0"
                />
              ) : (
                <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              {!isCollapsed && (
                <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium truncate text-foreground leading-tight text-xs">
                      {user.name}
                    </span>
                    <span className="text-muted-foreground truncate leading-none text-[10px]">
                      {user.email}
                    </span>
                  </div>
                  <ChevronUp className="size-4 shrink-0 text-muted-foreground ml-auto" />
                </>
              )}
            </button>
          }
        />

        <DropdownMenuContent
          align={isCollapsed ? "center" : "end"}
          side={isCollapsed ? "right" : "top"}
          sideOffset={8}
          className="min-w-56 py-2"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground truncate mt-1">
                {user.email}
              </p>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() =>
              window.open(
                "https://github.com/Rajat0741/SparkVoid/issues/new",
                "_blank",
              )
            }
          >
            <Bug className="size-4 mr-2" />
            Report a bug
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              router.push("/settings");
              if (isMobile) setOpenMobile(false);
            }}
          >
            <Settings className="size-4 mr-2" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            disabled={isLoggingOut}
            onClick={() => handleLogout()}
          >
            {isLoggingOut ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="size-4 mr-2" />
            )}
            {isLoggingOut ? "Logging out..." : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}

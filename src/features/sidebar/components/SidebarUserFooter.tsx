"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { LogOut, Sun, Moon, ChevronUp } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSidebar } from "@/components/ui/sidebar";
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
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 outline-none cursor-pointer",
              isCollapsed ? "justify-center p-1" : ""
            )}
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={24}
                height={24}
                className="rounded-full shrink-0 border border-border"
              />
            ) : (
              <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-border">
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
        className="w-56"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Toggle Theme Menu Item */}
        <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
          {theme === "dark" ? (
            <>
              <Sun className="size-4 mr-2" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="size-4 mr-2" />
              <span>Dark Mode</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout Menu Item */}
        <DropdownMenuItem
          onClick={handleLogout}
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import Link from "next/link";
import { CircleEllipsis } from "lucide-react";

export function ViewAll() {
  return (
    <div className="relative group/view-all">
      <Link href="/search">
        <div
          className="flex items-center gap-2 group-hover/view-all:bg-sidebar-accent group-hover/view-all:text-sidebar-accent-foreground cursor-pointer transition-all duration-200 border-transparent rounded-lg px-3 py-2.5 text-sm font-sans truncate"
        >
          <CircleEllipsis className="h-4 w-4" />
          All Chats
        </div>
      </Link>
    </div>
  );
}

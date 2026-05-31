"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { deleteConversationAction } from "../../actions/delete-conversation-action";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface ConversationActionsProps {
  conversationId: string;
}

export function ConversationActions({
  conversationId,
}: ConversationActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { execute, isExecuting } = useAction(deleteConversationAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Conversation deleted");

      if (pathname === `/chat/${conversationId}`) {
        router.push("/chat");
      }
    },

    onError: () => {
      toast.error("Failed to delete conversation");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
        <div
          role="button"
          tabIndex={0}
          className="flex items-center justify-center h-6 w-6 rounded hover:bg-sidebar-accent-foreground/10"
        >
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          variant="destructive"
          disabled={isExecuting}
          onClick={() => execute({ conversationId })}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

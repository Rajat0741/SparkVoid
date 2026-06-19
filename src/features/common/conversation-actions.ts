import { Pen, Share2, Trash2, Pin, PinOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ConversationType } from "@/lib/db/schema";

export interface ConversationActionItem {
  key: string;
  label: string;
  icon: LucideIcon;
  variant?: "destructive";
  separatorBefore?: boolean;
}

export function getConversationActionItems(
  conversation: ConversationType
): ConversationActionItem[] {
  return [
    {
      key: "pin",
      label: conversation.isPinned ? "Unpin" : "Pin",
      icon: conversation.isPinned ? PinOff : Pin,
    },
    { key: "rename", label: "Rename", icon: Pen },
    { key: "share", label: "Share", icon: Share2 },
    { key: "delete", label: "Delete", icon: Trash2, variant: "destructive", separatorBefore: true },
  ];
}

import { Pen, Share2, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ConversationActionItem {
  key: "rename" | "share" | "delete";
  label: string;
  icon: LucideIcon;
  variant?: "destructive";
}

export const conversationActionItems: ConversationActionItem[] = [
  { key: "rename", label: "Rename", icon: Pen },
  { key: "share", label: "Share", icon: Share2 },
  { key: "delete", label: "Delete", icon: Trash2, variant: "destructive" },
];

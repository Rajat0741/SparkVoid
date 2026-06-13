import { Pen, Share2, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ConversationActionItem {
  key: "rename" | "share" | "delete";
  label: string;
  icon: LucideIcon;
  variant?: "destructive";
  /** "dialog" actions open a dialog; "immediate" actions fire inline */
  type: "dialog" | "immediate";
}

export const conversationActionItems: ConversationActionItem[] = [
  { key: "rename", label: "Rename", icon: Pen, type: "dialog" },
  { key: "share", label: "Share", icon: Share2, type: "dialog" },
  { key: "delete", label: "Delete", icon: Trash2, type: "immediate", variant: "destructive" },
];

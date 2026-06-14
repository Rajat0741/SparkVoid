"use client";

import { useState } from "react";

export function useConversationActions() {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const onRename = () => setIsRenameOpen(true);
  const onShare = () => setIsShareOpen(true);
  const onDelete = () => setIsDeleteOpen(true);

  return {
    isRenameOpen,
    setIsRenameOpen,
    isShareOpen,
    setIsShareOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    onRename,
    onShare,
    onDelete,
  };
}

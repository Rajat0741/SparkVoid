import { notFound } from "next/navigation";
import { findConversationById } from "@/lib/db/queries";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ChatLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const conversation = await findConversationById(id);

  if (!conversation) {
    notFound();
  }

  return <>{children}</>;
}

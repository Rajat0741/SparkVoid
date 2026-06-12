import { findMessagesByConversationId } from "@/lib/db/queries";
import { toUIMessage } from "@/utils/toUIMessage";
import ChatInterface from "@/features/chat/components/layout/ChatInterface";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { id } = await params;

  const rawHistory = await findMessagesByConversationId(id);
  const initialMessages = toUIMessage(rawHistory);

  return (
    <ChatInterface
      key={id}
      conversationId={id}
      initialMessages={initialMessages}
    />
  );
}

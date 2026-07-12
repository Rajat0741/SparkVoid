import { generateId } from "ai";
import ChatInterface from "@/features/chat/components/layout/ChatInterface";

interface ChatRootPageProps {
  searchParams: Promise<{ temporary?: string }>;
}

export default async function ChatRootPage({ searchParams }: ChatRootPageProps) {
  const { temporary } = await searchParams;
  const isTemporaryChat = temporary !== undefined;
  const newId = generateId();

  return (
    <ChatInterface
      key={isTemporaryChat ? "temporary" : "new"}
      conversationId={newId}
      initialMessages={[]}
      isTemporaryChat={isTemporaryChat}
    />
  );
}

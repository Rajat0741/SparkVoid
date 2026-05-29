import { getConversationHistory } from "@/features/chat/services/get-messages";
import { toUIMessage } from "@/utils/toUIMessage";
import ChatInterface from "@/features/chat/components/ChatInterface";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch from DB
  const rawHistory = await getConversationHistory(id);
  
  // Transform to CustomUIMessage[]
  const initialMessages = toUIMessage(rawHistory);

  return (
    <ChatInterface 
      conversationId={id} 
      initialMessages={initialMessages}
    />
  );
}

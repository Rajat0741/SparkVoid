import { getConversationHistory } from "@/features/chat/services/get-messages";
import { toUIMessage } from "@/utils/toUIMessage";
import ChatClientPage from "./chat-client-page";

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
    <ChatClientPage 
      conversationId={id} 
      initialMessages={initialMessages} 
    />
  );
}

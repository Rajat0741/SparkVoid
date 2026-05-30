import { generateId } from "ai";
import ChatInterface from "@/features/chat/components/layout/ChatInterface";

export default function ChatRootPage() {
  const newId = generateId();
  return (
    <ChatInterface 
      key={newId}
      conversationId={newId} 
      initialMessages={[]}
    />
  );
}

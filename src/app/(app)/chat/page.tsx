import { generateId } from "ai";
import ChatInterface from "@/features/chat/components/ChatInterface";

export default function ChatRootPage() {
  const newId = generateId();
  return (
    <ChatInterface 
      conversationId={newId} 
      initialMessages={[]} 
    />
  );
}

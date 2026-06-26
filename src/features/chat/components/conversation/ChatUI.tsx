"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageSquare } from "lucide-react";
import MessageUI from "./MessageUI";
import { GenerationError } from "./GenerationError";
import { useChatContext } from "@/features/chat/components/layout/ChatProvider";

export default function ChatUI() {
  const messages = useChatContext((s) => s.messages);
  const status = useChatContext((s) => s.status);
  const error = useChatContext((s) => s.error);
  const clearError = useChatContext((s) => s.clearError);

  return (
    <div className="w-full mx-auto relative size-full">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent className="max-w-215 w-full mx-auto">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              <>
                <MessageUI messages={messages} status={status} />
                {error && <GenerationError error={error} onDismiss={clearError} />}
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
    </div>
  );
}

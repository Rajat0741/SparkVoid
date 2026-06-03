"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageSquare } from "lucide-react";
import type { CustomUIMessage } from "@/types";
import MessageUI from "./MessageUI";
import { GenerationError } from "./GenerationError";

interface ChatUIProps {
  messages: CustomUIMessage[];
  status: string;
  error: Error | undefined;
}

export default function ChatUI({
  messages,
  status,
  error,
}: ChatUIProps) {
  return (
    <div className="w-3xl mx-auto p-6 relative size-full">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              <>
                <MessageUI messages={messages} status={status} />
                {error && <GenerationError error={error} />}
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
    </div>
  );
}

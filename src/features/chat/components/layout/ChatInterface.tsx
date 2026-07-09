"use client";

import Image from "next/image";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import PromptUI from "@/features/chat/components/prompt/PromptUI";
import MessageUI from "@/features/chat/components/conversation/MessageUI";
import { GenerationError } from "@/features/chat/components/conversation/GenerationError";
import { ChatProvider, useChatContext } from "./ChatProvider";
import type { CustomUIMessage } from "@/types";
import { useTemporaryChat } from "../../hooks/use-temporary-chat";

function ChatContent() {
  const messages = useChatContext((s) => s.messages);
  const status = useChatContext((s) => s.status);
  const error = useChatContext((s) => s.error);
  const clearError = useChatContext((s) => s.clearError);
  const isTemporaryChat = useTemporaryChat();

  if (messages.length === 0) {
    if (isTemporaryChat) {
      return (<div className="flex flex-col items-center md:justify-center md:gap-10 flex-1 w-full max-w-2xl mx-auto px-4 pt-16 pb-4 md:py-0 h-full">
        {/* Mobile Header */}
        <div className="flex-1 flex items-center justify-center w-full md:hidden">
          <h1 className="text-3xl text-foreground select-none text-center">
            Welcome, Stranger
          </h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-3 select-none">
          <h1
            className="text-5xl text-foreground"
            aria-label="Incognito"
          >
            Incognito mode active
          </h1>
        </div>
        <PromptUI className="w-full" />
      </div>)
    }
    return (
      <div className="flex flex-col items-center md:justify-center md:gap-10 flex-1 w-full max-w-2xl mx-auto px-4 pt-16 pb-4 md:py-0 h-full">
        {/* Mobile Header */}
        <div className="flex-1 flex items-center justify-center w-full md:hidden">
          <h1 className="text-3xl text-foreground select-none text-center">
            What do you want to know?
          </h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-3 select-none">
          <Image src="/icon.svg" alt="SparkVoid Logo" width={48} height={48} className="size-12 shrink-0" />
          <h1
            className="text-5xl text-foreground"
            aria-label="SparkVoid"
          >
            SparkVoid
          </h1>
        </div>
        <PromptUI className="w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col size-full pb-4 overflow-hidden">
      <div className="flex-1 min-h-0 w-full relative flex flex-col">
        <Conversation>
          <ConversationContent className="max-w-215 w-full mx-auto">
            <MessageUI messages={messages} status={status} />
            {error && <GenerationError error={error} onDismiss={clearError} />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
      <PromptUI className="w-full max-w-3xl mx-auto px-2" />
    </div>
  );
}

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages: CustomUIMessage[];
}

export default function ChatInterface({
  conversationId,
  initialMessages,
}: ChatInterfaceProps) {
  return (
    <ChatProvider conversationId={conversationId} initialMessages={initialMessages}>
      <ChatContent />
    </ChatProvider>
  );
}

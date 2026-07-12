"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import PromptUI from "@/features/chat/components/prompt/PromptUI";
import MessageUI from "@/features/chat/components/conversation/MessageUI";
import { GenerationError } from "@/features/chat/components/conversation/GenerationError";
import { ChatProvider, useChatContext } from "./ChatProvider";
import { ChatToolbar } from "./ChatToolbar";
import type { CustomUIMessage } from "@/types";
import { cn } from "@/lib/utils";

function ChatContent() {
  const messages = useChatContext((s) => s.messages);
  const status = useChatContext((s) => s.status);
  const error = useChatContext((s) => s.error);
  const clearError = useChatContext((s) => s.clearError);
  const isTemporaryChat = useChatContext((s) => s.isTemporaryChat);

  if (messages.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center flex-1 size-full">
        <ChatToolbar />
        <motion.div
          key={isTemporaryChat ? "incognito" : "normal"}
          className={cn(
            isTemporaryChat ? undefined : "gap-3",
            "flex items-center justify-center"
          )}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {!isTemporaryChat && (
            <Image
              src="/icon.svg"
              alt="SparkVoid Logo"
              width={48}
              height={48}
              className="size-12 shrink-0"
            />
          )}
          <h1
            className={`text-foreground text-4xl md:text-5xl max-w-5/6 text-center md:max-w-full wrap-normal`}
            aria-label={isTemporaryChat ? "Incognito" : "SparkVoid"}
          >
            {isTemporaryChat ? "Incognito mode active" : "SparkVoid"}
          </h1>
        </motion.div>
        <PromptUI className="absolute bottom-4 w-full px-4 max-w-2xl md:static md:mt-8" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col size-full pb-4 overflow-hidden">
      <ChatToolbar />
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
  isTemporaryChat?: boolean;
}

export default function ChatInterface({
  conversationId,
  initialMessages,
  isTemporaryChat = false,
}: ChatInterfaceProps) {
  return (
    <ChatProvider
      conversationId={conversationId}
      initialMessages={initialMessages}
      isTemporaryChat={isTemporaryChat}
    >
      <div className="h-full flex flex-col">
        <ChatContent />
      </div>
    </ChatProvider>
  );
}

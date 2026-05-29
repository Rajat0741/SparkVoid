"use client";

import ChatUI from "@/features/chat/components/conversation/ChatUI";
import PromptUI from "@/features/chat/components/prompt/PromptUI";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname, useRouter } from "next/navigation";
import { CustomUIMessage } from "@/types";
import { Sparkles } from "lucide-react";
import { UIMessage, UIDataTypes, UITools } from "ai";

export default function ChatInterface({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: CustomUIMessage[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { messages, sendMessage, status, error } = useChat({
    id: conversationId,
    onFinish: () => router.refresh(),
    messages: initialMessages as UIMessage<unknown, UIDataTypes, UITools>[],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          conversationId: id,
          message: messages.at(-1),
        },
      }),
    }),
  });

  const handleSendMessage: typeof sendMessage = async (message, options) => {
    if (pathname === "/chat") {
      window.history.replaceState(null, "", `/chat/${conversationId}`);
    }
    await sendMessage(message, options);
  };

  // Centered Empty/New Chat Layout
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto px-4 h-full">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-8 select-none">
          <div className="flex items-center justify-center size-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-amber-500/15">
            <Sparkles className="size-8 animate-pulse text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-sans">
            What can I help with?
          </h1>
        </div>

        {/* Centered Prompt box */}
        <PromptUI 
          sendMessage={handleSendMessage} 
          className="w-full"
        />
      </div>
    );
  }

  // Active Chat Layout
  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-4 pb-4 overflow-hidden">
      <div className="flex-1 min-h-0 w-full relative">
        <ChatUI messages={messages} status={status} error={error} />
      </div>
      <div className="shrink-0 w-full mt-4">
        <PromptUI sendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

"use client";

import ChatUI from "@/features/chat/components/conversation/ChatUI";
import PromptUI from "@/features/chat/components/PromptUI";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { CustomUIMessage } from "@/types";

import { UIMessage, UIDataTypes, UITools } from "ai";

export default function ChatClientPage({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: CustomUIMessage[];
}) {
  const router = useRouter();

  const { messages, sendMessage, status, error } = useChat({
    id: conversationId,
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
    onFinish: () => {
      router.refresh();
    },
  });

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <ChatUI messages={messages} status={status} error={error} />
      <PromptUI sendMessage={sendMessage} />
    </div>
  );
}

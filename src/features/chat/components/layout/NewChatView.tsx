"use client";

import PromptUI from "@/features/chat/components/prompt/PromptUI";
import type { SendMessageFunctionType } from "@/types";
import { Sparkles } from "lucide-react";

interface NewChatViewProps {
  sendMessage: SendMessageFunctionType;
}

export default function NewChatView({ sendMessage }: NewChatViewProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto px-4 h-full">
      <div className="flex flex-col items-center gap-4 text-center mb-8 select-none">
        <div className="flex items-center justify-center size-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-amber-500/15">
          <Sparkles className="size-8 animate-pulse text-amber-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-sans">
          What can I help with?
        </h1>
      </div>
      <PromptUI sendMessage={sendMessage} className="w-full" />
    </div>
  );
}

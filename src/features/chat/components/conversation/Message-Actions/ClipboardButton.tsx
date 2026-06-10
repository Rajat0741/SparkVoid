"use client";

import { MessageAction } from "@/components/ai-elements/message";
import type { CustomUIMessage } from "@/types";
import { Check, Copy } from "lucide-react";
import { useState, useCallback } from "react";

interface ClipboardButtonProps {
  message: CustomUIMessage;
}

export function ClipboardButton({ message }: ClipboardButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [message.parts]);

  return (
    <MessageAction
      tooltip={copied ? "Copied!" : "Copy"}
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy message"}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </MessageAction>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { OneTapPrompt } from "@/components/auth/one-tap-prompt";
import { importConversationAction } from "../actions/import-conversation-action";
import { ShareHeader } from "./ShareHeader";
import { ShareFooter } from "./ShareFooter";
import { SignInDialog } from "./SignInDialog";
import MessageUI from "@/features/chat/components/conversation/MessageUI";
import type { ConversationType } from "@/lib/db/schema";
import type { CustomUIMessage } from "@/types";

interface SharePageClientProps {
  conversation: ConversationType;
  messages: CustomUIMessage[];
  isAuthenticated: boolean;
}

export function SharePageClient({
  conversation,
  messages,
  isAuthenticated,
}: SharePageClientProps) {
  const router = useRouter();
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const { execute: executeImport, isExecuting: isImporting } = useAction(
    importConversationAction,
    {
      onSuccess: ({ data }) => {
        if (data?.newConversationId) {
          toast.success("Conversation imported!");
          router.push(`/chat/${data.newConversationId}`);
        }
      },
      onError: () => {
        toast.error("Failed to import conversation. Please try again.");
      },
    }
  );

  const handleImport = () => {
    executeImport({ conversationId: conversation.id });
  };

  const handleSignIn = () => {
    setIsSignInOpen(true);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Auto-prompt One Tap for guests — stays on the same page on success */}
      {!isAuthenticated && (
        <OneTapPrompt onSuccess={() => router.refresh()} />
      )}

      <ShareHeader
        title={conversation.title}
        isAuthenticated={isAuthenticated}
        isImporting={isImporting}
        onSignIn={handleSignIn}
        onImport={handleImport}
      />

      {/* Read-only conversation view */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <MessageUI messages={messages} readOnly />
        </div>
      </main>

      <ShareFooter
        isAuthenticated={isAuthenticated}
        isImporting={isImporting}
        onSignIn={handleSignIn}
        onImport={handleImport}
      />

      <SignInDialog open={isSignInOpen} onOpenChange={setIsSignInOpen} />
    </div>
  );
}

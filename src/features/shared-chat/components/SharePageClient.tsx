"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { BookmarkPlus, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OneTapPrompt } from "@/components/auth/one-tap-prompt";
import { importConversationAction } from "../actions/import-conversation-action";
import { SignInDialog } from "./SignInDialog";
import MessageUI from "@/features/chat/components/conversation/MessageUI";
import type { ConversationType } from "@/lib/db/schema";
import type { CustomUIMessage } from "@/types";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ImportCtaProps {
  isAuthenticated: boolean;
  isImporting: boolean;
  onImport: () => void;
  onSignIn: () => void;
}

function ImportCta({ isAuthenticated, isImporting, onImport, onSignIn }: ImportCtaProps) {
  if (isAuthenticated) {
    return (
      <Button
        size="sm"
        onClick={onImport}
        disabled={isImporting}
        className="shrink-0 gap-1.5"
      >
        {isImporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
        {isImporting ? "Importing…" : "Import"}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onSignIn}
      className="shrink-0 gap-1.5"
    >
      <LogIn className="h-3.5 w-3.5" />
      Sign in
    </Button>
  );
}

interface ShareHeaderProps {
  title: string;
  isAuthenticated: boolean;
  isImporting: boolean;
  onImport: () => void;
  onSignIn: () => void;
}

function ShareHeader({ title, isAuthenticated, isImporting, onImport, onSignIn }: ShareHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-all group-hover:bg-primary/15">
            <Image src="/icon.svg" alt="SparkVoid Logo" width={20} height={20} className="h-5 w-5" />
          </span>
          <span className="tracking-tight">SparkVoid</span>
        </Link>

        <p className="truncate text-center text-sm">{title}</p>

        <ImportCta
          isAuthenticated={isAuthenticated}
          isImporting={isImporting}
          onImport={onImport}
          onSignIn={onSignIn}
        />
      </div>
    </header>
  );
}


// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------

interface SharePageClientProps {
  conversation: ConversationType;
  messages: CustomUIMessage[];
  isAuthenticated: boolean;
}

export function SharePageClient({ conversation, messages, isAuthenticated }: SharePageClientProps) {
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

  const handleImport = () => executeImport({ conversationId: conversation.id });
  const handleSignIn = () => setIsSignInOpen(true);

  return (
    <div className="flex h-dvh flex-col bg-background">
      {!isAuthenticated && <OneTapPrompt onSuccess={() => router.refresh()} />}

      <ShareHeader
        title={conversation.title}
        isAuthenticated={isAuthenticated}
        isImporting={isImporting}
        onImport={handleImport}
        onSignIn={handleSignIn}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
          <MessageUI messages={messages} readOnly />
        </div>
      </main>



      <SignInDialog open={isSignInOpen} onOpenChange={setIsSignInOpen} />
    </div>
  );
}

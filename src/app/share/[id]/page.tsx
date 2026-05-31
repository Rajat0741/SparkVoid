import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getSharedConversation } from "@/features/shared-chat/services/get-shared-conversation";
import { getConversationHistory } from "@/features/chat/services/get-messages";
import { SharePageClient } from "@/features/shared-chat/components/SharePageClient";
import { toUIMessage } from "@/utils/toUIMessage";
import { auth } from "@/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SharedConversationPage({ params }: PageProps) {
  const { id } = await params;

  const conversation = await getSharedConversation(id);

  if (!conversation) {
    notFound();
  }

  const [rawMessages, session] = await Promise.all([
    getConversationHistory(id),
    // Fetch session opportunistically — no redirect if absent (guests are welcome)
    auth.api.getSession({ headers: await headers() }).catch(() => null),
  ]);

  const messages = toUIMessage(rawMessages);

  return (
    <SharePageClient
      conversation={conversation}
      messages={messages}
      isAuthenticated={!!session?.user}
    />
  );
}

import { db } from "@/lib/db";
import { attachments } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";

interface LinkPendingAttachmentsParams {
  userId: string;
  messageId: string;
  conversationId: string;
  attachmentURLs: string[];
}

/**
 * Links any pending attachments uploaded by the user to the specific message and conversation.
 */
export async function linkPendingAttachments({
  userId,
  messageId,
  conversationId,
  attachmentURLs
}: LinkPendingAttachmentsParams): Promise<void> {
  await db
    .update(attachments)
    .set({
      status: "attached",
      messageId,
      conversationId,
    })
    .where(
      and(
        eq(attachments.userId, userId),
        eq(attachments.status, "pending"),
        inArray(attachments.url, attachmentURLs),
      ),
    );
}

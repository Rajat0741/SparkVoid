import { db } from "@/lib/db";
import { attachments, AttachmentType, NewAttachmentType } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export async function insertAttachment(
  data: NewAttachmentType,
): Promise<AttachmentType> {
  const [result] = await db.insert(attachments).values(data).returning();
  return result;
}

export async function findAttachmentByIdAndUser(
  attachmentId: string,
  userId: string,
): Promise<AttachmentType | null> {
  const [result] = await db
    .select()
    .from(attachments)
    .where(and(eq(attachments.id, attachmentId), eq(attachments.userId, userId)))
    .limit(1);
  return result ?? null;
}

export async function findAttachmentFileIdsByConversationId(
  conversationId: string,
): Promise<{ imagekitFileId: string }[]> {
  return db
    .select({ imagekitFileId: attachments.imagekitFileId })
    .from(attachments)
    .where(eq(attachments.conversationId, conversationId));
}

export async function linkPendingAttachments(
  userId: string,
  messageId: string,
  conversationId: string,
  attachmentURLs: string[],
): Promise<void> {
  if (attachmentURLs.length === 0) return;
  await db
    .update(attachments)
    .set({ status: "attached", messageId, conversationId })
    .where(
      and(
        eq(attachments.userId, userId),
        eq(attachments.status, "pending"),
        inArray(attachments.url, attachmentURLs),
      ),
    );
}

export async function deleteAttachmentById(attachmentId: string): Promise<void> {
  await db.delete(attachments).where(eq(attachments.id, attachmentId));
}

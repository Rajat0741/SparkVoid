import { db } from "@/lib/db";
import { attachments, AttachmentType, NewAttachmentType } from "@/lib/db/schema";
import { and, count, eq, inArray, notInArray } from "drizzle-orm";

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

export async function findAttachmentsByConversationId(
  conversationId: string,
): Promise<AttachmentType[]> {
  return db
    .select()
    .from(attachments)
    .where(eq(attachments.conversationId, conversationId));
}

export async function findAttachmentsByMessageIds(
  conversationId: string,
  messageIds: string[],
): Promise<AttachmentType[]> {
  if (messageIds.length === 0) return [];
  return db
    .select()
    .from(attachments)
    .where(
      and(
        eq(attachments.conversationId, conversationId),
        inArray(attachments.messageId, messageIds),
      ),
    );
}

export async function countDuplicateFileReferences(
  imagekitFileId: string,
  excludedAttachmentIds: string[],
): Promise<number> {

  const conditions = [eq(attachments.imagekitFileId, imagekitFileId)];
  
  if (excludedAttachmentIds.length > 0) {
    conditions.push(notInArray(attachments.id, excludedAttachmentIds));
  }

  const [result] = await db
    .select({ count: count() })
    .from(attachments)
    .where(and(...conditions));
  return Number(result?.count ?? 0);
}

export async function insertAttachmentBatch(
  data: NewAttachmentType[],
): Promise<AttachmentType[]> {
  if (data.length === 0) return [];
  return db.insert(attachments).values(data).returning();
}


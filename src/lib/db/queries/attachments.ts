import { db, type TransactionScope } from "@/lib/db";
import {
  attachments,
  AttachmentType,
  NewAttachmentType,
} from "@/lib/db/schema";
import { and, count, eq, inArray, notInArray } from "drizzle-orm";

export async function insertAttachment(
  data: NewAttachmentType,
  executor: TransactionScope = db,
): Promise<AttachmentType> {
  const [result] = await executor.insert(attachments).values(data).returning();
  return result;
}

export async function findAttachmentByIdAndUser(
  attachmentId: string,
  userId: string,
  executor: TransactionScope = db,
): Promise<AttachmentType | null> {
  const [result] = await executor
    .select()
    .from(attachments)
    .where(
      and(eq(attachments.id, attachmentId), eq(attachments.userId, userId)),
    )
    .limit(1);
  return result ?? null;
}

export async function linkPendingAttachments(
  userId: string,
  messageId: string,
  conversationId: string,
  attachmentURLs: string[],
  executor: TransactionScope = db,
): Promise<void> {
  if (attachmentURLs.length === 0) return;
  await executor
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

export async function deleteAttachmentById(
  attachmentId: string,
  executor: TransactionScope = db,
): Promise<void> {
  await executor.delete(attachments).where(eq(attachments.id, attachmentId));
}

export async function findAttachmentsByConversationId(
  conversationId: string,
  executor: TransactionScope = db,
): Promise<AttachmentType[]> {
  return executor
    .select()
    .from(attachments)
    .where(eq(attachments.conversationId, conversationId));
}

export async function findAttachmentsByMessageIds(
  conversationId: string,
  messageIds: string[],
  executor: TransactionScope = db,
): Promise<AttachmentType[]> {
  if (messageIds.length === 0) return [];
  return executor
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
  executor: TransactionScope = db,
): Promise<number> {
  const conditions = [eq(attachments.imagekitFileId, imagekitFileId)];

  if (excludedAttachmentIds.length > 0) {
    conditions.push(notInArray(attachments.id, excludedAttachmentIds));
  }

  const [result] = await executor
    .select({ count: count() })
    .from(attachments)
    .where(and(...conditions));
  return Number(result?.count ?? 0);
}

export async function insertAttachmentBatch(
  data: NewAttachmentType[],
  executor: TransactionScope = db,
): Promise<AttachmentType[]> {
  if (data.length === 0) return [];
  return executor.insert(attachments).values(data).returning();
}

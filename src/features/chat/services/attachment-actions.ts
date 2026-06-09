"use server";

import { authActionClient } from "@/lib/safe-action";
import { db } from "@/lib/db";
import { attachments } from "@/lib/db/schema";
import { AppError } from "@/utils/app-error";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { imagekit } from "@/lib/imagekit";
import { NotFoundError } from "@imagekit/nodejs";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const createPendingAttachmentSchema = z.object({
  id:             z.string(),
  fileName:       z.string(),
  fileType:       z.string(),
  fileSize:       z.number().int().positive(),
  imagekitFileId: z.string(),
  url:            z.url(),
  thumbnailUrl:   z.url().nullable().optional(),
});

const deleteAttachmentSchema = z.object({
  attachmentId: z.string(),
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * Persists an attachment record with status 'pending' immediately after a
 * successful ImageKit upload. The record is linked to a message once the
 * user submits the prompt.
 */
export const createPendingAttachmentAction = authActionClient
  .inputSchema(createPendingAttachmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [attachment] = await db
      .insert(attachments)
      .values({
        id:             parsedInput.id,
        userId:         ctx.user.id,
        status:         "pending",
        fileName:       parsedInput.fileName,
        fileType:       parsedInput.fileType,
        fileSize:       parsedInput.fileSize,
        imagekitFileId: parsedInput.imagekitFileId,
        url:            parsedInput.url,
        thumbnailUrl:   parsedInput.thumbnailUrl ?? null,
      })
      .returning();

    return { attachment };
  });

/**
 * Removes a pending attachment from the DB and deletes it from ImageKit.
 * Only the owning user can delete their attachments.
 */
export const deleteAttachmentAction = authActionClient
  .inputSchema(deleteAttachmentSchema)
  .action(async ({ parsedInput: { attachmentId }, ctx }) => {
    const [attachment] = await db
      .select()
      .from(attachments)
      .where(
        and(eq(attachments.id, attachmentId), eq(attachments.userId, ctx.user.id))
      )
      .limit(1);

    if (!attachment) {
      throw new AppError("Attachment not found", 404);
    }

    // Delete from ImageKit via the Node.js SDK
    try {
      await imagekit.files.delete(attachment.imagekitFileId);
    } catch (error) {
      // A 404 from ImageKit is fine — the file may already be gone
      if (!(error instanceof NotFoundError)) {
        throw new AppError("Failed to delete file from ImageKit", 502);
      }
    }

    await db.delete(attachments).where(eq(attachments.id, attachmentId));

    return { deleted: true };
  });

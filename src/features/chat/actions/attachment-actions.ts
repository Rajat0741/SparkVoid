"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  insertAttachment,
  findAttachmentByIdAndUser,
  deleteAttachmentById,
} from "@/lib/db/queries";
import { AppError } from "@/utils/app-error";
import { deleteUnreferencedAttachments } from "@/lib/imagekit";
import z from "zod";

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
    const attachment = await insertAttachment({
      id:             parsedInput.id,
      userId:         ctx.user.id,
      status:         "pending",
      fileName:       parsedInput.fileName,
      fileType:       parsedInput.fileType,
      fileSize:       parsedInput.fileSize,
      imagekitFileId: parsedInput.imagekitFileId,
      url:            parsedInput.url,
      thumbnailUrl:   parsedInput.thumbnailUrl ?? null,
    });

    return { attachment };
  });

/**
 * Removes a pending attachment from the DB and deletes it from ImageKit.
 * Only the owning user can delete their attachments.
 */
export const deleteAttachmentAction = authActionClient
  .inputSchema(deleteAttachmentSchema)
  .action(async ({ parsedInput: { attachmentId }, ctx }) => {
    const attachment = await findAttachmentByIdAndUser(attachmentId, ctx.user.id);

    if (!attachment) {
      throw new AppError("Attachment not found", 404);
    }

    await deleteUnreferencedAttachments([attachment], [attachmentId]);

    await deleteAttachmentById(attachmentId);
    return { deleted: true };
  });

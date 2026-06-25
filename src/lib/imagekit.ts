import ImageKit from "@imagekit/nodejs";
import { countDuplicateFileReferences } from "@/lib/db/queries";
import type { AttachmentType } from "@/lib/db/schema";

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error("Missing IMAGEKIT_PRIVATE_KEY environment variable");
}

export const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export async function deleteUnreferencedAttachments(
  attachmentsList: AttachmentType[],
  excludedAttachmentIds: string[],
): Promise<void> {
  await Promise.all(
    attachmentsList.map(async (att) => {
      const otherCount = await countDuplicateFileReferences(
        att.imagekitFileId,
        excludedAttachmentIds,
      );

      if (otherCount === 0) {
        try {
          await imagekit.files.delete(att.imagekitFileId);
        } catch (error: unknown) {
          if (
            error &&
            typeof error === "object" &&
            "status" in error &&
            error.status === 404
          )
            return;

          console.error(
            `Failed to delete ImageKit file ${att.imagekitFileId}:`,
            error,
          );
        }
      }
    }),
  );
}

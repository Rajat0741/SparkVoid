"use server";

import { authActionClient } from "@/lib/safe-action";
import { deleteAllConversationsByUserId, findAttachmentsByUserId } from "@/lib/db/queries";
import { deleteUnreferencedAttachments } from "@/lib/imagekit";

export const deleteAllConversationsAction = authActionClient.action(
  async ({ ctx }) => {
    const userId = ctx.user.id;

    // Fetch all attachments for this user so we can clean up ImageKit files.
    // Pass an empty excludedIds list — we want to delete every file that has
    // no other owner, which countDuplicateFileReferences handles internally.
    const userAttachments = await findAttachmentsByUserId(userId);

    if (userAttachments.length > 0) {
      const attachmentIds = userAttachments.map((a) => a.id);
      await deleteUnreferencedAttachments(userAttachments, attachmentIds);
    }

    // Deleting conversations cascades to messages and attachments in the DB.
    await deleteAllConversationsByUserId(userId);

    return { success: true };
  }
);

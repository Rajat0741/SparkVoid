"use client";

import { upload } from "@imagekit/next";
import {
  createPendingAttachmentAction,
  deleteAttachmentAction,
} from "@/features/chat/actions/attachment-actions";
import { useEffect, useState } from "react";

export type AttachmentUploadStatus = "uploading" | "error" | "done";

export interface AttachmentUploadState {
  status: AttachmentUploadStatus;
  error?: string;
}

export interface UploadedAttachment {
  id: string;
  imagekitFileId: string;
  url: string;
  thumbnailUrl: string | null;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export function useAttachmentUpload(isTemporaryChat: boolean) {
  // Set of attachment IDs currently being uploaded, mapped to their upload state
  const [uploadStates, setUploadStates] = useState<Map<string, AttachmentUploadState>>(new Map());
  // Map of successfully uploaded attachments, keyed by attachment ID
  const [uploadedFiles, setUploadedFiles] = useState< Map<string, UploadedAttachment>>(new Map());

  const uploadInProgress: boolean = [...uploadStates.values()]
    .some((state) => state.status === "uploading");
  
  const setState = (id: string, state: AttachmentUploadState | null) => {
    setUploadStates((prev) => {
      const next = new Map(prev);
      if (state === null) next.delete(id);
      else next.set(id, state);
      return next;
    });
  };

  const handleFilesAdded = async (
    entries: { id: string; file: File }[],
  ) => {
    if (isTemporaryChat) return;

    const uploadPromises = entries.map(async ({ id, file }) => {
      setState(id, { status: "uploading" });

      try {
        const authResponse = await fetch("/api/upload-auth");

        if (!authResponse.ok) {
          throw new Error(`Upload auth failed: ${await authResponse.text()}`);
        }

        const authParams: {
          token: string;
          expire: number;
          signature: string;
          publicKey: string;
        } = await authResponse.json();

        const response = await upload({
          file,
          fileName: file.name,
          expire: authParams.expire,
          token: authParams.token,
          signature: authParams.signature,
          publicKey: authParams.publicKey,
          folder: "/SparkVoid/chat-attachments",
        });

        if (!response.fileId || !response.url) {
          throw new Error("ImageKit upload returned incomplete metadata");
        }

        const uploaded: UploadedAttachment = {
          id,
          imagekitFileId: response.fileId,
          url: response.url,
          thumbnailUrl: response.thumbnailUrl ?? null,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        };

        setUploadedFiles((prev) => new Map(prev).set(id, uploaded));

        const result = await createPendingAttachmentAction({
          id: uploaded.id,
          fileName: uploaded.fileName,
          fileType: uploaded.fileType,
          fileSize: uploaded.fileSize,
          imagekitFileId: uploaded.imagekitFileId,
          url: uploaded.url,
          thumbnailUrl: uploaded.thumbnailUrl,
        });

        if (result?.serverError) throw new Error(result.serverError);

        setState(id, { status: "done" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setState(id, { status: "error", error: message });
        console.error("Attachment upload failed:", err);
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleFileRemoved = async (id: string) => {
    setState(id, null);
    setUploadedFiles((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    if (isTemporaryChat) return;

    await deleteAttachmentAction({ attachmentId: id }).catch((err) => {
      console.error("Failed to delete attachment from server:", err);
    });
  };

  const clearUploads = () => {
    setUploadedFiles(new Map());
    setUploadStates(new Map());
  };

  const discardPendingUploads = async () => {
    const attachmentIds = [...uploadedFiles.keys()];
    clearUploads();

    if (attachmentIds.length === 0) return;

    await Promise.all(
      attachmentIds.map((attachmentId) =>
        deleteAttachmentAction({ attachmentId }).catch((err) => {
          console.error("Failed to delete attachment from server:", err);
        }),
      ),
    );
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void discardPendingUploads();
    });

    return () => window.clearTimeout(timeoutId);
    // Mode changes invalidate all attachments. Submission uses clearUploads
    // directly so successfully linked attachments are never deleted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTemporaryChat]);

  return {
    uploadedFiles,
    uploadStates,
    uploadInProgress,
    handleFilesAdded,
    handleFileRemoved,
    clearUploads,
  };
}

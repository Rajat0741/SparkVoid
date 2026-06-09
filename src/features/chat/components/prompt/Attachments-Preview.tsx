"use client";

import {
  Attachment,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  type AttachmentData,
  getAttachmentLabel,
  getMediaCategory,
} from "@/components/ai-elements/attachments";
import { usePromptInputAttachments } from "@/components/ai-elements/prompt-input";
import { type AttachmentUploadState } from "@/hooks/use-attachment-upload";
import Image from "next/image";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { memo, useCallback } from "react";

// ============================================================================
// Types
// ============================================================================

interface AttachmentItemProps {
  attachment: AttachmentData & { id: string };
  onRemove: (id: string) => void;
  state?: AttachmentUploadState;
}

// ============================================================================
// UploadStatusOverlay — progress ring or error badge
// ============================================================================

const UploadStatusOverlay = ({ state }: { state?: AttachmentUploadState }) => {

  if (!state || state.status === "done") return null;

  if (state.status === "error") {
    return (
      <div
        aria-label={state.error ?? "Upload failed"}
        className="absolute inset-0 flex items-center justify-center rounded-md bg-destructive/20"
        title={state.error ?? "Upload failed"}
      >
        <AlertCircleIcon className="size-3 text-destructive" />
      </div>
    );
  }

  // uploading
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/50 backdrop-blur-[1px]">
      <Loader2Icon className="size-3 animate-spin text-muted-foreground" />
    </div>
  );
};

// ============================================================================
// AttachmentItem
// ============================================================================

const AttachmentItem = memo(({ attachment, onRemove, state }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id]
  );
  const mediaCategory = getMediaCategory(attachment);
  const label = getAttachmentLabel(attachment);

  return (
    <AttachmentHoverCard>
      <AttachmentHoverCardTrigger>
        <Attachment data={attachment} onRemove={handleRemove}>
          {/* Icon area: preview fades out on hover to reveal the remove button */}
          <div className="relative size-5 shrink-0">
            <div className="absolute inset-0 transition-opacity group-hover:opacity-0">
              <AttachmentPreview />
            </div>
            {/* Upload progress / error overlay */}
            <UploadStatusOverlay state={state} />
            <AttachmentRemove className="absolute inset-0" />
          </div>
          <AttachmentInfo />
        </Attachment>
      </AttachmentHoverCardTrigger>

      <AttachmentHoverCardContent>
        <div className="space-y-3">
          {mediaCategory === "image" &&
            attachment.type === "file" &&
            attachment.url && (
              <div className="flex max-h-96 w-80 items-center justify-center overflow-hidden rounded-md border">
                <Image
                  alt={label}
                  className="max-h-full max-w-full object-contain"
                  height={384}
                  src={attachment.url}
                  width={320}
                />
              </div>
            )}
          <div className="space-y-1 px-0.5">
            <h4 className="font-semibold text-sm leading-none">{label}</h4>
            {attachment.mediaType && (
              <p className="font-mono text-muted-foreground text-xs">
                {attachment.mediaType}
              </p>
            )}
          </div>
        </div>
      </AttachmentHoverCardContent>
    </AttachmentHoverCard>
  );
});

AttachmentItem.displayName = "AttachmentItem";

// ============================================================================
// AttachmentsDisplay
// ============================================================================

/**
 * Renders the inline attachment chips inside the PromptInput header.
 * Reads from and writes to the shared PromptInput attachments context.
 * Returns null when there are no attachments so the header stays hidden.
 */
export const AttachmentsDisplay = ({
  uploadStates,
}: {
  uploadStates: Map<string, AttachmentUploadState>;
}) => {
  const { files, remove } = usePromptInputAttachments();

  if (files.length === 0) return null;

  return (
    <Attachments variant="inline">
      {files.map((attachment) => (
        <AttachmentItem
          attachment={attachment}
          key={attachment.id}
          onRemove={remove}
          state={uploadStates.get(attachment.id)}
        />
      ))}
    </Attachments>
  );
};

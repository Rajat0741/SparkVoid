"use client";

import type { MessagePart } from "@/types";
import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
} from "@/components/ai-elements/attachments";

interface AttachmentsMessageProps {
  parts: MessagePart[];
  groupKey: string;
}

export function AttachmentsMessage({ parts, groupKey }: AttachmentsMessageProps) {
  const fileParts = parts.filter((part) => part.type === "file");

  if (fileParts.length === 0) return null;

  return (
    <Attachments className="mb-2" variant="grid">
      {fileParts.map((file, i) => {
        const data = {
          id: `${groupKey}-file-${i}`,
          type: "file" as const,
          filename: file.filename || "Attachment",
          mediaType: file.mediaType,
          url: file.url,
        };
        return (
          <a
            key={data.id}
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Attachment className="cursor-pointer" data={data}>
              <AttachmentPreview />
            </Attachment>
          </a>
        );
      })}
    </Attachments>
  );
}

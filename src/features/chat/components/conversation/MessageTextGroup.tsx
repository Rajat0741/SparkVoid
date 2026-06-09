"use client";

import { isTextUIPart } from "ai";
import { MessageResponse } from "@/components/ai-elements/message";
import type { MessagePart } from "@/types";
import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentHoverCard,
  AttachmentHoverCardTrigger,
  AttachmentHoverCardContent,
} from "@/components/ai-elements/attachments";

interface MessageTextGroupProps {
  parts: MessagePart[];
  groupKey: string;
}

export function MessageTextGroup({ parts, groupKey }: MessageTextGroupProps) {
  const textParts = parts.filter(isTextUIPart);
  const fileParts = parts.filter((part) => part.type === "file");

  return (
    <>
      {fileParts.length > 0 && (
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
              <AttachmentHoverCard key={data.id}>
                <AttachmentHoverCardTrigger render={<span />}>
                  <Attachment className="cursor-pointer" data={data}>
                    <AttachmentPreview />
                    <AttachmentInfo />
                  </Attachment>
                </AttachmentHoverCardTrigger>
                <AttachmentHoverCardContent>
                  <div className="space-y-3">
                    {file.mediaType?.startsWith("image/") && file.url && (
                      <div className="flex max-h-96 w-80 items-center justify-center overflow-hidden rounded-md border bg-muted/20">
                        <img
                          alt={file.filename || "Image Preview"}
                          className="max-h-full max-w-full object-contain"
                          src={file.url}
                        />
                      </div>
                    )}
                    <div className="space-y-1 px-0.5">
                      <h4 className="font-semibold text-sm leading-none">
                        {file.filename || "Attachment"}
                      </h4>
                      {file.mediaType && (
                        <p className="font-mono text-muted-foreground text-xs">
                          {file.mediaType}
                        </p>
                      )}
                    </div>
                  </div>
                </AttachmentHoverCardContent>
              </AttachmentHoverCard>
            );
          })}
        </Attachments>
      )}

      {textParts.map((part, i) => (
        <MessageResponse key={`${groupKey}-text-${i}`}>
          {part.text}
        </MessageResponse>
      ))}
    </>
  );
}


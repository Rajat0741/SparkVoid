import {
  PromptInputHeader,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { type AttachmentUploadState } from "@/hooks/use-attachment-upload";
import { AttachmentsDisplay } from "./Attachments-Preview";

type PromptUIHeaderProps = {
  uploadStates: Map<string, AttachmentUploadState>;
};

export function PromptUIHeader({ uploadStates }: PromptUIHeaderProps) {
  const { files } = usePromptInputAttachments();
  if (files.length === 0) return null;
  return (
    <PromptInputHeader>
      <AttachmentsDisplay uploadStates={uploadStates} />
    </PromptInputHeader>
  );
}

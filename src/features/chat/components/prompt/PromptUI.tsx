import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { useChatContext } from "@/features/chat/components/layout/ChatProvider";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { PromptUIHeader } from "./PromptUIHeader";
import { PromptUIFooter } from "./PromptUIFooter";
import type { FileUIPart } from "ai";
import { toast } from "sonner";

interface PromptUIProps {
  className?: string;
}

export default function PromptUI({ className }: PromptUIProps) {
  const conversationId = useChatContext((s) => s.conversationId);
  const sendMessage = useChatContext((s) => s.sendMessage);
  const {
    uploadedFiles,
    uploadStates,
    uploadInProgress,
    handleFilesAdded,
    handleFileRemoved,
    clearUploads,
  } = useAttachmentUpload(conversationId);

  const status = useChatContext((s)=> s.status)
  const submitIsBlocked = uploadInProgress || status!=="ready"

  const handleSubmit = async (message: PromptInputMessage) => {
    if (submitIsBlocked) {
      return
    }
      
    // Replace base64 data URLs from PromptInput with ImageKit URLs
    const fileParts: FileUIPart[] = [...uploadedFiles.values()].map(
      (uploaded) => ({
        type: "file" as const,
        filename: uploaded.fileName,
        mediaType: uploaded.fileType,
        url: uploaded.url,
      }),
    );

    await sendMessage({ text: message.text, files: fileParts });
    clearUploads();
  };

  const handlePromptInputError = (err: {
    code: "max_files" | "max_file_size" | "accept";
    message: string;
  }) => {
    toast.error(err.message);
  };

  return (
    <div className={className}>
      <PromptInput
        onSubmit={handleSubmit}
        onFilesAdded={handleFilesAdded}
        onFileRemoved={handleFileRemoved}
        multiple
        maxFiles={5}
        onError={handlePromptInputError}
      >
        <PromptUIHeader uploadStates={uploadStates} />
        <PromptInputBody>
          <PromptInputTextarea placeholder="How can I help you today?" />
        </PromptInputBody>
        <PromptUIFooter uploadInProgress={uploadInProgress} />
      </PromptInput>
    </div>
  );
}

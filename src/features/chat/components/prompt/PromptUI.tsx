import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
  type PromptInputMessage,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
} from "@/components/ai-elements/prompt-input";
import { useChatContext } from "@/features/chat/components/layout/ChatProvider";
import {
  useAttachmentUpload,
} from "@/hooks/use-attachment-upload";
import { PromptUIHeader } from "./PromptUIHeader";
import type { FileUIPart } from "ai";
import { toast } from "sonner";

interface PromptUIProps {
  className?: string;
}

export default function PromptUI({ className }: PromptUIProps) {
  const { conversationId, sendMessage, status, stop } = useChatContext();
  const {
    uploadedFiles,
    uploadStates,
    handleFilesAdded,
    handleFileRemoved,
    clearUploads,
  } = useAttachmentUpload(conversationId);

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasUploadsInProgress = [...uploadStates.values()].some(
      (s) => s.status === "uploading",
    );
    if (hasUploadsInProgress) return;

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
        <PromptInputFooter>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
              <PromptInputActionAddScreenshot />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <PromptInputTools />
          <PromptInputSubmit status={status} onStop={stop} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

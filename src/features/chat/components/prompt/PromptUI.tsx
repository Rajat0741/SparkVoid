import { useState } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { useChatContext } from "@/features/chat/components/layout/ChatProvider";
import {
  type AttachmentUploadState,
  useAttachmentUpload,
} from "@/hooks/use-attachment-upload";
import { PromptUIHeader } from "./PromptUIHeader";
import { PromptUIFooter } from "./PromptUIFooter";
import type { FileUIPart } from "ai";
import { toast } from "sonner";

interface PromptUIProps {
  className?: string;
}

const EMPTY_UPLOAD_STATES = new Map<string, AttachmentUploadState>();

export default function PromptUI({ className }: PromptUIProps) {
  const conversationId = useChatContext((s) => s.conversationId);
  const sendMessage = useChatContext((s) => s.sendMessage);
  const isTemporaryChat = useChatContext((s) => s.isTemporaryChat);
  const [textInput, setTextInput] = useState("");
  const selectedModel = useChatContext((s) => s.modelId);
  const setSelectedModel = useChatContext((s) => s.setModelId);
  const {
    uploadedFiles,
    uploadStates,
    uploadInProgress,
    handleFilesAdded,
    handleFileRemoved,
    clearUploads,
  } = useAttachmentUpload(conversationId);

  const status = useChatContext((s) => s.status);
  const activeUploadInProgress = !isTemporaryChat && uploadInProgress;
  const submitIsBlocked = activeUploadInProgress || status !== "ready";

  const handleSubmit = async (message: PromptInputMessage) => {
    if (submitIsBlocked) {
      return
    }

    const fileParts: FileUIPart[] = isTemporaryChat
      ? message.files
      : [...uploadedFiles.values()].map((uploaded) => ({
          type: "file" as const,
          filename: uploaded.fileName,
          mediaType: uploaded.fileType,
          url: uploaded.url,
        }));

    setTextInput("");

    await sendMessage(
      { text: message.text, files: fileParts },
      { body: { model: selectedModel } },
    );
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
        onFilesAdded={isTemporaryChat ? undefined : handleFilesAdded}
        onFileRemoved={isTemporaryChat ? undefined : handleFileRemoved}
        multiple
        maxFiles={5}
        accept="image/*"
        onError={handlePromptInputError}
      >
        <PromptUIHeader
          uploadStates={isTemporaryChat ? EMPTY_UPLOAD_STATES : uploadStates}
        />
        <PromptInputBody>
          <PromptInputTextarea
            placeholder="How can I help you today?"
            onChange={(e) => setTextInput(e.currentTarget.value)}
            className="p-3 text-base"
          />
        </PromptInputBody>
        <PromptUIFooter
          uploadInProgress={activeUploadInProgress}
          textInput={textInput}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />
      </PromptInput>
    </div>
  );
}

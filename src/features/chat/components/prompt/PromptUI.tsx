import { useState } from "react";
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

  const status = useChatContext((s)=> s.status)
  const submitIsBlocked = uploadInProgress || status!=="ready"

  const handleSubmit = async (message: PromptInputMessage) => {
    if (submitIsBlocked) {
      return
    }

    const fileParts: FileUIPart[] = [...uploadedFiles.values()].map(
      (uploaded) => ({
        type: "file" as const,
        filename: uploaded.fileName,
        mediaType: uploaded.fileType,
        url: uploaded.url,
      }),
    );

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
        onFilesAdded={handleFilesAdded}
        onFileRemoved={handleFileRemoved}
        multiple
        maxFiles={5}
        accept="image/*"
        onError={handlePromptInputError}
      >
        <PromptUIHeader uploadStates={uploadStates} />
        <PromptInputBody>
          <PromptInputTextarea
            placeholder="How can I help you today?"
            onChange={(e) => setTextInput(e.currentTarget.value)}
            className="p-3 text-base"
          />
        </PromptInputBody>
        <PromptUIFooter
          uploadInProgress={uploadInProgress}
          textInput={textInput}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel} />
      </PromptInput>
    </div>
  );
}

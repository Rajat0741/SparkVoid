import {
  PromptInputFooter,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { useChatContext } from "@/features/chat/components/layout/ChatProvider";
import { ModelSelect } from "./ModelSelect";
import type { ModelId } from "@/features/chat/validators";

interface PromptUIFooterProps {
  uploadInProgress: boolean;
  textInput: string;
  selectedModel: ModelId;
  onSelectModel: (model: ModelId) => void;
}

export function PromptUIFooter({
  uploadInProgress,
  textInput,
  selectedModel,
  onSelectModel,
}: PromptUIFooterProps) {
  const status = useChatContext((s) => s.status);
  const stop = useChatContext((s) => s.stop);

  return (
    <PromptInputFooter>
        <PromptInputActionMenu>
          <PromptInputActionMenuTrigger />
          <PromptInputActionMenuContent className={"flex flex-col gap-1 border"}>
            <PromptInputActionAddAttachments className="w-full text-base" label="Add images" />
            <PromptInputActionAddScreenshot className="w-full text-base" />
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>
      <div className="ml-auto flex items-center gap-3">
        <ModelSelect value={selectedModel} onChange={onSelectModel} />
        <PromptInputSubmit
          disabled={(!textInput.trim() && status === "ready") || uploadInProgress || status === "submitted"}
          status={status}
          onStop={stop}
          className={"size-9"}
        />
      </div>
    </PromptInputFooter>
  );
}

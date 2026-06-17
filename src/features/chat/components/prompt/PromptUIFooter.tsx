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

interface PromptUIFooterProps {
  uploadInProgress: boolean;
  textInput: string;
  selectedModel: string;
  onSelectModel: (model: string) => void;
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
      <div className="flex items-center gap-1">
        <PromptInputActionMenu>
          <PromptInputActionMenuTrigger />
          <PromptInputActionMenuContent>
            <PromptInputActionAddAttachments className="w-full"/>
            <PromptInputActionAddScreenshot className="w-full" />
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>
        <ModelSelect value={selectedModel} onChange={onSelectModel} />
      </div>
      <PromptInputSubmit
        disabled={!textInput.trim() || uploadInProgress || status === "submitted"}
        status={status}
        onStop={stop}
      />
    </PromptInputFooter>
  );
}

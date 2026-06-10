import {
  PromptInputFooter,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputTools,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { useChatContext } from "@/features/chat/components/layout/ChatProvider";

interface PromptUIFooterProps {
  uploadInProgress: boolean;
}

export function PromptUIFooter({ uploadInProgress }: PromptUIFooterProps) {
  const { status, stop } = useChatContext();

  return (
    <PromptInputFooter>
      <PromptInputActionMenu>
        <PromptInputActionMenuTrigger />
        <PromptInputActionMenuContent>
          <PromptInputActionAddAttachments />
          <PromptInputActionAddScreenshot />
        </PromptInputActionMenuContent>
      </PromptInputActionMenu>
      <PromptInputTools />
      <PromptInputSubmit
        disabled={uploadInProgress || status === "submitted"}
        status={status}
        onStop={stop}
      />
    </PromptInputFooter>
  );
}

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { useChatContext } from "@/features/chat/components/layout/ChatProvider";

interface PromptUIProps {
  className?: string;
}

export default function PromptUI({ className }: PromptUIProps) {
  const { sendMessage } = useChatContext();

  const handleSubmit = (message: PromptInputMessage) => sendMessage(message);

  return (
    <div className={className}>
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputTextarea placeholder="How can I help you today?" />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

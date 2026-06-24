import { CustomUIMessage } from "@/types";
import { tagAgentMessages } from "../tag-agent-messages";

export const prepareMessage = (
  history: CustomUIMessage[],
  message: CustomUIMessage,
): CustomUIMessage[] => {
  const messages = [...history, message];

  // Filter reasoning parts before sending to the model
  const filteredMessages = messages.map((msg) => ({
    ...msg,
    parts: msg.parts.filter((part) => part.type !== "reasoning"),
  }));

  return tagAgentMessages(filteredMessages);
};

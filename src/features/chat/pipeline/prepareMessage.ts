import { CustomUIMessage } from "@/types";

export const prepareMessage = (
  history: CustomUIMessage[],
  message: CustomUIMessage,
): CustomUIMessage[] => {
  const messages = [...history, message];

  // Filter reasoning parts before sending to the model
  return messages.map((msg) => ({
    ...msg,
    parts: msg.parts.filter((part) => part.type !== "reasoning"),
  }));
};

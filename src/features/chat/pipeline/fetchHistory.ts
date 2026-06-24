import { findMessagesByConversationId } from "@/lib/db/queries";
import { toUIMessage } from "@/utils/toUIMessage";
import { CustomUIMessage } from "@/types";

export const fetchHistory = async (conversationId: string): Promise<CustomUIMessage[]> => {
  const conversationHistory = await findMessagesByConversationId(conversationId);
  return toUIMessage(conversationHistory);
};

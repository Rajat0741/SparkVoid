import ky from "ky";
import { queryOptions } from "@tanstack/react-query";
import type { ConversationType } from "@/lib/db/schema";
import { conversationKeys } from "@/features/common/queries/conversation-keys";

export const getConversationDetailQuery = async (
  id: string,
): Promise<ConversationType> => {
  const res = await ky
    .get(`/api/conversations/${id}`)
    .json<{ conversation: ConversationType }>();

  return res.conversation;
};

export const getConversationDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: conversationKeys.detail(id),
    queryFn: () => getConversationDetailQuery(id),
  });

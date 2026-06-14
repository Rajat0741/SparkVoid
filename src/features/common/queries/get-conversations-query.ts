import ky from "ky";
import type { ConversationType } from "@/lib/db/schema";
import { conversationKeys } from "@/features/common/queries/conversation-keys";

export const getConversationQuery = async (
  limit: number,
  cursor?: Date,
  query?: string,
): Promise<ConversationType[]> => {
  const res = await ky
    .post("/api/conversations", { json: { limit, cursor, query } })
    .json<{ conversations: ConversationType[] }>();

  return res.conversations ?? [];
};

export const getConversationQueryOptions = () => ({
  queryKey: conversationKeys.list(),
  queryFn: () => getConversationQuery(15),
});

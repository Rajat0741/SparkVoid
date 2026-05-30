import { queryOptions } from "@tanstack/react-query";
import type { ConversationType } from "@/lib/db/schema";

const getConversationQueryFunction = async (): Promise<
  ConversationType[]
> => {
  const response: Response = await fetch(`/api/conversations`);
  const data = await response.json();
  return data.conversations;
};

export const getConversationQueryOptions = () =>
  queryOptions({
    queryKey: ["conversations"],
    queryFn: () => getConversationQueryFunction(),
  });

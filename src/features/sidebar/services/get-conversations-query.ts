import { queryOptions } from "@tanstack/react-query";
import type { ConversationType } from "@/lib/db/schema";

const getConversationQueryFunction = async (): Promise<
  ConversationType[]
> => {
  const response: Response = await fetch(`/api/conversations`);
  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }
  const data = await response.json();
  return data.conversations ?? [];
};

export const getConversationQueryOptions = () =>
  queryOptions({
    queryKey: ["conversations"],
    queryFn: () => getConversationQueryFunction(),
  });

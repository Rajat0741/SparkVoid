"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getConversationQuery } from "@/features/common/queries/get-conversations-query";
import { conversationKeys } from "../queries/conversation-keys";
import type { ConversationType } from "@/lib/db/schema";

const PAGE_SIZE = 12;

interface UseConversationsInfiniteOptions {
  /** When provided, switches to title-search mode. */
  search?: string;
}

export function useConversationsInfinite(
  { search }: UseConversationsInfiniteOptions = {},
) {
  const query = useInfiniteQuery({
    queryKey: conversationKeys.infinite({ search }),
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as Date | undefined;
      return getConversationQuery(PAGE_SIZE, cursor, search);
    },
    initialPageParam: undefined as Date | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      // Use the updatedAt of the last item as the cursor
      return lastPage[lastPage.length - 1]?.updatedAt;
    },
  });

  return {
    conversations: query.data?.pages.flat() ?? [],
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

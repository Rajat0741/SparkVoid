"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ItemGroup } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getConversationQuery } from "@/features/common/queries/get-conversations-query";
import { conversationKeys } from "@/features/common/queries/conversation-keys";
import { ConversationItem } from "./ConversationItem";

const PAGE_SIZE = 12;

interface SearchConversationListProps {
  search: string;
}

export function SearchConversationList({
  search,
}: SearchConversationListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
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

  const conversations = data?.pages.flat() ?? [];

  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <ConversationListSkeleton />;
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center py-16 px-4">
        <p className="text-sm text-muted-foreground">
          {search ? `No chats matching "${search}"` : "No chats yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex overflow-y-auto px-4 py-3">
      <ItemGroup className="gap-1">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            isActive={false}
            conversation={conv}
          />
        ))}
      </ItemGroup>

      {/* Intersection observer sentinel */}
      <div ref={sentinelRef} className="py-2 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-1.5 w-1.5 rounded-full" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationListSkeleton() {
  return (
    <div className="flex-1 px-4 py-3 space-y-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5 px-3 py-2.5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}

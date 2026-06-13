/**
 * Hierarchical query key factory for conversations.
 *
 * Hierarchy:
 *   all → lists → list(filters) → search(query)
 *
 * Using a factory ensures invalidation is predictable:
 *   - invalidate `all` to bust both sidebar and search caches
 *   - invalidate `lists()` to bust only paginated views
 */
export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, "list"] as const,
  list: (filters?: { search?: string }) =>
    [...conversationKeys.lists(), filters ?? {}] as const,
  infinite: (filters?: { search?: string }) =>
    [...conversationKeys.all, "infinite", filters ?? {}] as const,
} as const;


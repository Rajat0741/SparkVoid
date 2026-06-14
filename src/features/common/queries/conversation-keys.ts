export const conversationKeys = {
  all: ["conversations"] as const,
  list: () => [...conversationKeys.all, "list"] as const,
  infinite: (filters?: { search?: string }) =>
    [...conversationKeys.all, "infinite", filters ?? {}] as const,
} as const;

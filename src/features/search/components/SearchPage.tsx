"use client";

import { useState, useTransition, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchConversationList } from "./SearchConversationList";

const SEARCH_DEBOUNCE_MS = 700;

export function SearchPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      startTransition(() => setDebouncedSearch(value.trim()));
    }, SEARCH_DEBOUNCE_MS);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-215 mx-auto bg-background">
      {/* {header} */}
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-2xl font-semibold">Chats</h1>
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            id="search-conversations-input"
            placeholder="Search chats by title..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="px-8 py-4"
          />
        </div>
      </div>
      {/* {Conversation List} */}
      <SearchConversationList search={debouncedSearch} />
    </div>
  );
}

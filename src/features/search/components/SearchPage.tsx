"use client";

import { useState, useCallback, useTransition } from "react";
import { SearchHeader } from "./SearchHeader";
import { SearchConversationList } from "./SearchConversationList";

/** Debounce delay (ms) before triggering a search query */
const SEARCH_DEBOUNCE_MS = 700;

export function SearchPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [, startTransition] = useTransition();

  // Debounce the search input to avoid firing a query on every keystroke
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    const timer = setTimeout(() => {
      startTransition(() => setDebouncedSearch(value.trim()));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <SearchHeader
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        isSearching={searchInput !== debouncedSearch}
      />
      <SearchConversationList
        search={debouncedSearch}
      />
    </div>
  );
}

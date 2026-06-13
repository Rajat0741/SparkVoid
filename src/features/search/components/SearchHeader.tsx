"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface SearchHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  isSearching: boolean;
}

export function SearchHeader({
  searchValue,
  onSearchChange,
  isSearching,
}: SearchHeaderProps) {
  return (
    <div className="flex flex-col gap-4 px-6 py-5 border-b">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Chats</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        {isSearching && (
          <Spinner className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        )}
        <Input
          id="search-conversations-input"
          placeholder="Search chats by title..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { SearchPage } from "@/features/search/components/SearchPage";

export const metadata: Metadata = {
  title: "All Chats — SparkVoid",
  description: "Browse, search, and manage all your conversations.",
};

export default function SearchRoute() {
  return <SearchPage />;
}

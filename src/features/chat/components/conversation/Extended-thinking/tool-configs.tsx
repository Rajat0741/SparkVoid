"use client";

import type { ReactNode } from "react";
import { GlobeIcon, Link2Icon, CloudSun } from "lucide-react";

export interface ToolConfig {
  key: string;
  icon: ReactNode;
  runningTitle: string;
  completedTitle: string;
  queryKey?: string;
}

export const TOOL_CONFIGS: ToolConfig[] = [
  {
    key: "weather",
    icon: <CloudSun className="size-4" />,
    runningTitle: "Fetching weather...",
    completedTitle: "Fetched weather for",
    queryKey: "location",
  },
  {
    key: "tavily",
    icon: <GlobeIcon className="size-4" />,
    runningTitle: "Searching ",
    completedTitle: "Searched ",
    queryKey: "query",
  },
  {
    key: "search",
    icon: <GlobeIcon className="size-4" />,
    runningTitle: "Searching ",
    completedTitle: "Searched ",
    queryKey: "query",
  },
  {
    key: "scrape",
    icon: <Link2Icon className="size-4" />,
    runningTitle: "Scraping ",
    completedTitle: "Scraped ",
    queryKey: "url",
  },
];

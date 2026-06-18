import { FirecrawlTools } from "firecrawl-aisdk";

const { systemPrompt, ...firecrawlTools } = FirecrawlTools({
  search: { limit: 8 },
  scrape: { formats: ["markdown"], onlyMainContent: true },
  interact: false,
});

export { systemPrompt as firecrawlSystemPrompt, firecrawlTools }
export const tavilySystemPrompt = `
## Web search (Tavily)
Use 'basic' searchDepth for quick lookups, definitions, single-fact questions.
Use 'advanced' only when the query needs multi-source verification, precise current statistics, or technical comparisons where shallow snippets would be unreliable.
Default to 'basic' — escalate only when basic results are clearly insufficient.
`;
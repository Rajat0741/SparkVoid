# Features of SparkVoid

## 🤖 Dual AI Agent Architecture
Two specialized agents, switchable mid-conversation, each with its own model and tool access.

*   **Spark**
    *   **LLM**: Gemini 3.1 Flash-Lite
    *   **Max Turns**: 5 tool-loop steps per query
    *   **Tools**: Tavily Web Search, Weather
    *   **Profile**: Fast, conversational, real-time web lookups
*   **Void**
    *   **LLM**: Gemini 3.1 Flash-Lite
    *   **Max Turns**: 12 tool-loop steps per query
    *   **Tools**: Firecrawl Search, Firecrawl Scrape, Weather
    *   **Profile**: Deep research — multi-page traversal and scraping for grounded, longer-form answers

---

## 💬 Core Chat Interface
*   **Streaming responses** via the Vercel AI SDK, token-by-token
*   **Extended thinking visibility** — shows the model's reasoning as it works through tool calls
*   **Persistent conversation history**, loaded on demand
*   **Cursor-based infinite scroll** on the sidebar conversation list (TanStack Query)
*   **Debounced client-side search** across conversation titles
*   **Conversation actions** — pin, rename, share, delete (mobile drawer / desktop dropdown)
*   **Skeleton loading states** across chat and navigation
*   **Mobile-first responsive layout** with auto-collapsing sidebar

---

## 📎 Media & Attachments
*   **Inline image uploads** from the prompt box
*   **ImageKit CDN hosting** with reference-counted cleanup (attachments are only deleted once no message references them)
*   **Attachment preview popover** before send

---

## 🎨 Rendering (Streamdown)
*   **Syntax highlighting** via Shiki
*   **LaTeX/math** via KaTeX
*   **Mermaid diagrams** rendered inline
*   **JSX preview rendering** for generated component code
*   Typography: Space Grotesk (headings) / Geist (body), Sky/Zinc theme

---

## 🔒 Authentication & Account Management
*   **Better Auth** with Google OAuth + inline One Tap
*   **Admin dashboard** via the Dash plugin (`@better-auth/infra`)
*   **Sentinel plugin** — role checks, ban management, session impersonation, proxy/IP forwarding detection
*   **Route-level middleware** protecting search, settings, and home routes; redirects authenticated users to the dashboard

---

## 💾 Database & Persistence
Neon (serverless Postgres) + Drizzle ORM.

*   `users` — accounts, roles, profile data
*   `conversations` — chat metadata and relations
*   `messages` — message content and parts (JSONB), per conversation
*   `attachments` — uploaded asset references
*   `user_usages` — daily token consumption, caps, reset timestamps

---

## ⚙️ Usage & Limits
*   **Real-time token usage** display with progress bar and IST-based reset countdown
*   **Server-side quota enforcement** on every API route, not just client-side display

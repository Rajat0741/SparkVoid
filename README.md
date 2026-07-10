# SparkVoid AI

SparkVoid is a modern, high-performance web AI workspace that blends search, web scraping, and semantic retrieval into a unified conversation. The application is built using Next.js 16 (App Router), React 19, Tailwind CSS v4, and Neon serverless PostgreSQL, powered by the Vercel AI SDK and Google Gemini models.

---

## 🚀 Key Features

*   **Dual AI Agent Modes**: Toggle between **Spark** (Tavily search-enabled, fast 5-step loop agent) and **Void** (Firecrawl-enabled scraping & deep-search 12-step loop agent).
*   **Temporary (Incognito) Chat Mode**: Start ephemeral conversations that run completely in memory without persisting messages or updating database history.
*   **Extended Thinking**: Full real-time thought chains streaming from Google Gemini models.
*   **Rich UI Markdown Renderer**: Render complex outputs including **LaTeX/Math Equations** (both block and inline via KaTeX), **Mermaid Diagrams**, and **Syntax Highlighted Code** (via Shiki).
*   **Conversational Search**: Client-side, debounced search across all conversation histories.
*   **Image Uploads**: Drag and drop image attachments processed instantly using ImageKit.
*   **Infrastructure-Grade Auth & Google One-Tap**: Seamless sign-in experiences built with Better Auth, integrated with Sentinel security plugins (banning, roles, impersonation) and Admin/Dash controls.
*   **Daily Token Limits & Pricing**: Track token usage with progress bars, reset countdowns in IST, and a public pricing page outlining the Free tier.

For a full breakdown of platform features, see **FEATURES.md** .

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Motion (Framer Motion v12), Zustand, TanStack React Query.
*   **AI Engine**: Vercel AI SDK v7 (`ai`, `@ai-sdk/google`), `@tavily/ai-sdk`, `firecrawl-aisdk`.
*   **Database**: PostgreSQL (Neon Database), Drizzle ORM.
*   **Auth**: Better Auth (with Google OAuth, Google One-Tap, Dash, Admin, and Sentinel security plugins).
*   **Monitoring**: Sentry (error tracking, performance monitoring, and custom metrics for agent selection, incognito sessions, and tool execution).
*   **Asset Management**: ImageKit NodeJS/Next SDK.
*   **Rendering**: Streamdown (`@streamdown/code`, `@streamdown/math`, `@streamdown/mermaid`), KaTeX, Shiki.

---

## ⚙️ Project Structure

```text
src/
├── app/               # Next.js App Router (Layouts, Pages, APIs)
│   ├── (app)/         # Main application views (chat, search, settings)
│   ├── login/         # Auth pages (with One-Tap and Google Sign-In)
│   └── globals.css    # Tailwind CSS v4 imports & custom design tokens
├── components/        # Shared presentation components (auth, theme-provider)
├── features/          # Domain-driven features
│   ├── chat/          # Chat UI, state stores, pipelines, and agents
│   ├── search/        # Search views and debounced listing logic
│   └── settings/      # Settings components and clean database actions
├── hooks/             # Custom React hooks
├── lib/               # Shared libraries (auth, db connection, utilities)
└── types/             # Global TypeScript type definitions
```

---

## 🏁 Getting Started

### Prerequisites
*   Node.js (v20+ recommended)
*   `pnpm` package manager

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` (or `.env`):
```bash
cp .env.example .env.local
```

Fill in the required configuration:
- **Database**: `DATABASE_URL` (Neon PostgreSQL connection string)
- **AI Keys**: `GOOGLE_API_KEY`, `TAVILY_API_KEY`, `FIRECRAWL_API_KEY`
- **Auth**: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (e.g., `http://localhost:3000`), `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- **Image Uploads**: `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_ENDPOINT`

### 3. Push Database Schema
Ensure your database tables are initialized using Drizzle Kit:
```bash
pnpm drizzle-kit push
```

### 4. Run the Development Server
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience SparkVoid.

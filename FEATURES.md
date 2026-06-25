# Features of SparkVoid

## 🤖 Dual AI Agent Architecture (ToolLoopAgent)
SparkVoid uses a dual-agent workspace powered by the Vercel AI SDK and Google Gemini models. You can switch between two specialized personalities:

*   **Spark**
    *   **Core Engine**: Gemini 3.1 Flash Lite.
    *   **Max Turns**: Up to 5 loop steps per query.
    *   **Integration**: Equipped with **Tavily Web Search** and **Weather** tools.
    *   **Profile**: Fast, search-driven answers with real-time web querying.
*   **Void**
    *   **Core Engine**: Gemini 3.1 Flash Lite.
    *   **Max Turns**: Up to 12 loop steps per query.
    *   **Integration**: Equipped with **Firecrawl Web Search**, **Firecrawl Scraping**, and **Weather** tools.
    *   **Profile**: Deep research workspace capable of traversing and scraping pages for rich context.

---

## 💬 Core Chat Interface
*   **Dynamic Streaming**: Real-time response generation utilizing the Vercel AI SDK stream interfaces.
*   **Extended Thinking Visibility**: Displays step-by-step reasoning/thought chains as the Gemini model works through a query.
*   **Conversation History**: Full preservation of previous conversations, loaded dynamically.
*   **Recent Chats Sidebar**: Collapsible navigation listing active/recent chat threads.
*   **Conversation Search**: Debounced client-side title search to filter historical chats instantly.
*   **Multi-Model Switching**: Seamlessly toggle between **Spark** and **Void** agent systems on the fly.

---

## 📎 Media & Attachments
*   **Image Uploads**: Local image attachment capabilities integrated directly inside the prompt box.
*   **Cloud Hosting**: Staged images are uploaded securely and hosted/optimized dynamically using **ImageKit CDN**.
*   **Visual Previews**: Popover-based preview of attachment list in the prompt input before submission.

---

## 🎨 Advanced UI & Rendering (Streamdown)
*   **Streamdown Parser**: Renders complex markdown structures gracefully, including:
    *   **Syntax Highlighting**: Powered by **Shiki** for formatted code blocks.
    *   **LaTeX / Math**: Native, client-side math equations powered by **KaTeX**.
    *   **Mermaid Diagrams**: Fully rendered diagrams directly inside message containers.
*   **Typography**: Clean visual layout using **Space Grotesk** for headings and **Geist** for body text.
*   **Dynamic Animations**: Micro-interactions powered by `motion/react` (Framer Motion).

---

## 🔒 Authentication & Account Management
*   **Better Auth Engine**: Secure authentication framework supporting full OAuth integration.
*   **One-Tap Auth**: Seamless Google One-Tap Prompt overlay on the login and home page.

---

## 💾 Database & Persistence
*   **Neon Serverless**: Cloud-hosted serverless PostgreSQL database.
*   **Drizzle ORM**: Type-safe query building and schema declarations.
*   **Tables Persisted**:
    *   `users`: Account settings and profiles.
    *   `conversations`: Chat topics, timestamps, and relations.
    *   `messages`: Individual user queries, assistant parts, and metadata.
    *   `attachments`: Details on uploaded assets.

---

## ⚙️ User Settings
*   **History Controls**: Action to delete entire conversation history safely from the database.

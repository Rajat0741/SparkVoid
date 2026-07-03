"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!session && !isPending) {
      authClient.oneTap({
        fetchOptions: {
          onSuccess: () => router.push("/chat"),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-120 w-180 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.22_292/0.22),transparent_70%)] blur-3xl"
      />

      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-amber-400" aria-hidden />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            SparkVoid
          </span>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
            <Sparkles className="size-3 text-amber-400" aria-hidden />
            Research · Search · Chat
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            SparkVoid
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            An AI workspace that combines web search, page scraping, and
            semantic retrieval into a single conversation.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Get started
            </Link>
            <Link
              href="/chat"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background/60 px-6 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-muted"
            >
              Open chat
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground"
        >
          {[
            "Web search via Tavily",
            "Page scraping with Firecrawl",
            "Multi-model AI chat",
          ].map((label) => (
            <span
              key={label}
              className="rounded-full border border-border bg-card/50 px-3 py-1.5 backdrop-blur"
            >
              {label}
            </span>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

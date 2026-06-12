import Link from "next/link";
import { ArrowLeft, Home, MessageCircle, SearchX, Sparkles } from "lucide-react";

const navigationItems = [
  {
    href: "/",
    label: "Home",
    description: "Start from the SparkVoid landing page.",
    icon: Home,
  },
  {
    href: "/chat",
    label: "Chat",
    description: "Open a fresh AI conversation.",
    icon: MessageCircle,
  },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-1 overflow-hidden bg-background px-6 py-10 text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[44px_44px] opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[linear-gradient(to_bottom,oklch(0.72_0.16_82/0.18),transparent)] dark:bg-[linear-gradient(to_bottom,oklch(0.72_0.16_82/0.12),transparent)]"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col justify-center gap-10 md:grid md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="max-w-2xl">
          <Link
            href="/"
            className="mb-10 inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background/80 px-3 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back home
          </Link>

          <div className="mb-5 ml-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
            <Sparkles className="size-3.5 text-amber-500" aria-hidden />
            Signal lost
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            This page slipped into the void.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            The address may be outdated, moved, or mistyped. Choose a route
            below and keep the conversation moving.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/chat"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Start a new chat
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
            >
              Return home
            </Link>
          </div>
        </div>

        <div className="relative rounded-xl border border-border bg-card/85 p-6 shadow-sm backdrop-blur">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="text-sm font-medium text-foreground">Route scan</p>
              <p className="text-xs text-muted-foreground">HTTP 404</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <SearchX className="size-5" aria-hidden />
            </div>
          </div>

          <div className="space-y-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

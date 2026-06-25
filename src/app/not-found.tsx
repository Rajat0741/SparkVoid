import Link from "next/link";
import { ArrowLeft, Home, MessageCircle, SearchX, Sparkles } from "lucide-react";

const navigationItems = [
  {
    href: "/",
    label: "Home",
    description: "Go back to the SparkVoid landing page.",
    icon: Home,
  },
  {
    href: "/chat",
    label: "Chat",
    description: "Start a fresh conversation.",
    icon: MessageCircle,
  },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-1 overflow-hidden bg-background px-6 py-10 text-foreground">
      {/* Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40"
      />

      {/* Violet glow — top center */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.22_292/0.22),transparent_70%)] blur-3xl"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col justify-center gap-10 md:grid md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div className="max-w-2xl">
          <Link
            href="/"
            className="mb-10 inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card/70 px-3 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back home
          </Link>

          <div className="mb-5 ml-0.5 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-amber-400" aria-hidden />
            404
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Slipped into the void.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
            That page doesn&apos;t exist or has moved. Pick a destination
            below.
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
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background/60 px-5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-muted"
            >
              Return home
            </Link>
          </div>
        </div>

        <div className="relative rounded-xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur">
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
                  className="group flex items-center gap-4 rounded-lg border border-border bg-background/50 p-4 backdrop-blur transition-colors hover:bg-muted"
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

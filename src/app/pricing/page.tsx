"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, ArrowLeft, Zap, Star } from "lucide-react";
import { motion } from "motion/react";
import { DAILY_CAP, PRO_DAILY_CAP } from "@/constants";

export default function PricingPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      {/* Grid background matching landing page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-120 w-180 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.22_292/0.22),transparent_70%)] blur-3xl"
      />

      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <Image src="/icon.svg" alt="SparkVoid Logo" width={20} height={20} className="size-5 shrink-0" />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            SparkVoid
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 max-w-2xl mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
            <Zap className="size-3 text-amber-400" />
            Pricing
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Simple, Transparent Plans
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Start with our generous free tier or prepare for the upcoming Pro features.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
          
          {/* Free Tier Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex flex-col justify-between rounded-2xl border border-border bg-card/40 p-8 backdrop-blur text-left"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">Free Tier</h3>
                <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
                  Active
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Perfect for standard everyday answers and basic web exploration.
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-sm text-muted-foreground"> / month</span>
              </div>

              <ul className="space-y-3.5 mb-8">
                {[
                  `${DAILY_CAP.toLocaleString("en-US", { notation: "compact" })} tokens per day limit`,
                  "Access to all models",
                  "Basic web search and scraping",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="size-4.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/chat"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Start Chatting
            </Link>
          </motion.div>

          {/* Pro Tier (Coming Soon) Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex flex-col justify-between rounded-2xl border border-amber-500/20 bg-card/50 p-8 backdrop-blur text-left overflow-hidden group"
          >
            {/* Glowing border effect */}
            <div className="absolute top-0 right-0 rounded-bl-xl bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border-l border-b border-amber-500/20 flex items-center gap-1.5">
              <Star className="size-3 fill-amber-400/20" />
              Coming Soon
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">Pro Tier</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                For power users who need high-volume, unrestricted access.
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$15</span>
                <span className="text-sm text-muted-foreground"> / month</span>
              </div>

              <ul className="space-y-3.5 mb-8">
                {[
                  `${PRO_DAILY_CAP.toLocaleString("en-US", { notation: "compact" })} daily token usage limit`,
                  "Advanced web search and scraping",
                  "Access to upcoming premium tools",
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="size-4.5 text-amber-500/40 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background/40 px-6 text-sm font-medium text-muted-foreground cursor-not-allowed"
            >
              Sign up placeholder
            </button>
          </motion.div>
          
        </div>
      </main>
    </div>
  );
}

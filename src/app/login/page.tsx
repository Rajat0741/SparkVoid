"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OneTapPrompt } from "@/components/auth/one-tap-prompt";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.7_0.15_280/0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.2_280/0.18),transparent_60%)]"
      />

      <OneTapPrompt onSuccess={() => router.push("/chat")} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm"
      >
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 shrink-0 text-amber-500 animate-pulse" />
            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              SparkVoid AI
            </h1>
          </div>

          <div className="flex w-full flex-col items-center gap-3">
            <GoogleSignInButton callbackURL="/chat" />
          </div>
        </div>
      </motion.div>

      <p className="relative z-10 mt-6 text-xs text-muted-foreground">
        <Link
          href="/"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Back to home
        </Link>
      </p>
    </div>
  );
}

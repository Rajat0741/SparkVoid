"use client";

import { authClient } from "@/lib/auth-client";
import { OneTapPrompt } from "@/components/auth/one-tap-prompt";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {!session && !isPending && <OneTapPrompt />}
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center px-6 py-24">
        <div className="flex flex-col items-center gap-8 text-center max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-6xl">
              SparkVoid AI
            </h1>
            <p className="text-xl leading-8 text-zinc-600 dark:text-zinc-400">
              Intelligent conversations. Limitless possibilities.
              <br />
              Experience the next generation of AI-powered chat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              Get Started
            </Link>
            <Link
              href="/chat"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 px-8 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

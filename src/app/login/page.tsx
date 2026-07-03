"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) router.replace("/chat");
  }, [session, router]);

  useEffect(() => {
    authClient.oneTap({
      fetchOptions: {
        onSuccess: () => router.push("/chat"),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPending || session) return null;

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-125 w-175 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.22_292/0.28),transparent_70%)] blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm rounded-xl border border-border bg-card/80 p-8 shadow-lg backdrop-blur"
      >
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0 text-amber-400" aria-hidden />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              SparkVoid
            </h1>
          </div>

          <div className="flex w-full flex-col gap-2">
            <p className="text-sm text-muted-foreground">Sign in to continue</p>
            <GoogleSignInButton callbackURL="/chat" />
          </div>
        </div>
      </motion.div>

      <p className="relative z-10 mt-6 text-xs text-muted-foreground">
        <Link
          href="/"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Back to home
        </Link>
      </p>
    </div>
  );
}

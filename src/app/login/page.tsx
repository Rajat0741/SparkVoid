"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      authClient.oneTap({
        button: {
          container: buttonRef.current,
          config: {
            theme: "outline",
            size: "large",
            type: "standard",
            text: "signin_with",
          },
        },
        fetchOptions: {
          onSuccess: () => router.push("/test"),
        },
      });
    }
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Welcome to{" "}
              <span className="text-foreground">SparkVoid AI</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue to your conversations
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-3">
            <div ref={buttonRef} className="w-full [&>div]:w-full" />
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        <Link href="/" className="underline underline-offset-2 hover:text-foreground">
          Back to home
        </Link>
      </p>
    </div>
  );
}

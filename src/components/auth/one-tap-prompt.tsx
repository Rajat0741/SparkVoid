"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface OneTapPromptProps {
  onSuccess?: () => void;
}

export function OneTapPrompt({ onSuccess }: OneTapPromptProps = {}) {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function triggerOneTap() {
      if (mounted) {
        await authClient.oneTap({
          fetchOptions: {
            onSuccess: () => {
              if (onSuccess) {
                onSuccess();
              } else {
                router.push("/chat");
              }
            },
          },
        });
      }
    }

    triggerOneTap();

    return () => {
      mounted = false;
    };
  }, [router, onSuccess]);

  return null;
}

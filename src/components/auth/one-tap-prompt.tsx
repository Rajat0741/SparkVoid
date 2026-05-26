"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function OneTapPrompt() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    
    async function triggerOneTap() {
      if (mounted) {
        await authClient.oneTap({
          fetchOptions: {
            onSuccess: () => {
              router.push("/test");
            },
          },
        });
      }
    }
    
    triggerOneTap();

    return () => {
      mounted = false;
    };
  }, [router]);

  return null;
}

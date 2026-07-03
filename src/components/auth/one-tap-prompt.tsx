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
    authClient.oneTap({
      fetchOptions: {
        onSuccess: () => {
          onSuccess?.() ?? router.push("/chat");
        },
      },
    });
    // One Tap initializes once on mount. Including onSuccess/router
    // in deps would reinitialize the Google script on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

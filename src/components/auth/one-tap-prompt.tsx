"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

interface OneTapPromptProps {
  redirectTo?: string;
}

export function OneTapPrompt({ redirectTo = "/chat" }: OneTapPromptProps = {}) {
  useEffect(() => {
    authClient.oneTap({
      callbackURL: redirectTo,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

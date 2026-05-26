"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This renders a "Sign in with Google" button using One Tap
    if (buttonRef.current) {
      authClient.oneTap({
        button: {
          container: buttonRef.current,
          config: {
            theme: "filled_blue",
            size: "large",
            type: "standard", // or "icon" for just the icon
            text: "signin_with", // or "signup_with", "continue_with"
          },
        },
        fetchOptions: {
          onSuccess: () => router.push("/test"),
        },
      });
    }
  }, [router]);

  return (
    <div>
      <h1> Sign In </h1>
      <div ref={buttonRef} />
    </div>
  );
}

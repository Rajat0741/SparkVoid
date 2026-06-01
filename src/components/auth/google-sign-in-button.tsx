"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface GoogleSignInButtonProps {
  callbackURL: string;
  className?: string;
  label?: string;
}

export function GoogleSignInButton({
  callbackURL,
  className,
  label = "Continue with Google",
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({ provider: "google", callbackURL });
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn("w-full gap-2", className)}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <FcGoogle className="h-4 w-4 shrink-0" />
      )}
      {isLoading ? "Signing in..." : label}
    </Button>
  );
}

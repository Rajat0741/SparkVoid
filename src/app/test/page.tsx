"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function TestPage() {
  const { data: session, isPending, error } = authClient.useSession();
  
  useEffect(() => {
    if (error) {
      console.error("Error fetching session:", error);
    } else {
      console.log("session:", session);
      
    }
  }, [isPending , error]);
  
  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
        <Spinner className="h-8 w-8 text-zinc-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Not logged in</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            You must be logged in to view your profile information.
          </p>
          <Button>
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Session Information</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Successfully authenticated via Better Auth
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={80}
              height={80}
              className="rounded-full border border-zinc-200 dark:border-zinc-800"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold border border-zinc-200 dark:border-zinc-800">
              {session.user.name.charAt(0)}
            </div>
          )}
          
          <div className="text-center">
            <h2 className="text-xl font-medium">{session.user.name}</h2>
            <p className="text-zinc-500 dark:text-zinc-400">{session.user.email}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  window.location.href = "/login";
                }
              }
            })}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

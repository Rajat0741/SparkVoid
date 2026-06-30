import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

export default function SharePageSkeleton() {
  return (
    <div className="flex h-dvh flex-col bg-background animate-pulse">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-20 border-b">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-4">
          <div className="group flex shrink-0 items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </span>
            <span className="tracking-tight font-semibold">SparkVoid</span>
          </div>

          <Skeleton className="h-4 w-1/3 rounded" />

          <Skeleton className="h-8 w-16 rounded-md shrink-0" />
        </div>
      </header>

      {/* Main Messages Skeleton */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 space-y-6">
          {/* Left message (Assistant) */}
          <div className="flex items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>

          {/* Right message (User) */}
          <div className="flex items-start justify-end gap-4">
            <div className="space-y-2 flex-1 flex flex-col items-end">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          </div>

          {/* Left message (Assistant) */}
          <div className="flex items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

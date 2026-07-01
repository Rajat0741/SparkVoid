import { Skeleton } from "@/components/ui/skeleton";

export default function ChatSkeleton() {
  return (
    <div className="flex flex-col size-full pb-4 overflow-hidden animate-pulse">
      {/* Messages area */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto px-4 py-6 space-y-6 max-w-3xl mx-auto">
        {/* Left message (Assistant) */}
        <div className="flex items-start gap-4">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
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
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        </div>

        {/* Left message (Assistant) with extended thought/response */}
        <div className="flex items-start gap-4">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-1/3 rounded" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>

      {/* Prompt Area */}
      <div className="w-full max-w-3xl mx-auto px-2 md:px-0">
        <div className="border rounded-2xl p-4 bg-muted/40 space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

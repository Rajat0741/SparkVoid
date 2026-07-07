import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl p-4">
        <Skeleton className="h-7 w-24 mb-1" />
        <Skeleton className="h-5 w-64 mb-6" />
        <div className="flex flex-col gap-8">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

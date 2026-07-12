import { UsageSection } from "@/features/settings/components/UsageSection";

export default async function SettingsPage() {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl p-4">
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground mb-6 border-b pb-2 border-foreground">
          Manage your account and data.
        </p>

        <div className="flex flex-col gap-8">
          <UsageSection />
        </div>
      </div>
    </div>
  );
}

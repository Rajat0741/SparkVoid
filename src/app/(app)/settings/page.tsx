import { DeleteHistorySection } from "@/features/settings/components/DeleteHistorySection";

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-xl font-semibold tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Manage your account and data.
        </p>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Data
          </h2>
          <DeleteHistorySection />
        </section>
      </div>
    </div>
  );
}

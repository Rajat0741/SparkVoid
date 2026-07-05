import { getUserSession } from "@/lib/getUser";
import { getUserUsage } from "@/lib/db/queries";
import { getFormattedTimeUntilNextReset } from "@/utils/time";
import { Progress } from "@/components/ui/progress";
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemHeader,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function toISTDateString(date: Date): string {
  return new Date(date.getTime() + IST_OFFSET_MS).toDateString();
}

function getUsageColor(percentage: number): string {
  if (percentage >= 90) return "bg-destructive";
  if (percentage >= 70) return "bg-yellow-500";
  return "bg-emerald-500";
}

export async function UsageSection() {
  const session = await getUserSession();
  const usage = await getUserUsage(session.user.id);

  let tokensUsed = 0;
  let dailyCap = 100000;

  if (usage) {
    dailyCap = usage.dailyCap;
    if (toISTDateString(new Date()) === toISTDateString(usage.updatedAt)) {
      tokensUsed = usage.tokensUsed;
    }
  }

  const percentage =
    dailyCap > 0 ? Math.min(100, Math.round((tokensUsed / dailyCap) * 100)) : 0;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-medium uppercase text-foreground">
        Usage
      </h2>

      <Item variant="outline" className="bg-card p-4">
        <ItemContent className="gap-4">
          <ItemHeader className="items-start">
            <div>
              <p className="text-sm font-medium">Daily Token Usage</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your remaining daily usage resets in{" "}
                {getFormattedTimeUntilNextReset()}.
              </p>
            </div>

            <div className="shrink-0 text-left md:text-right">
              <p className="text-sm font-semibold tracking-tight">
                {tokensUsed.toLocaleString()} / {dailyCap.toLocaleString()} tokens
              </p>
              <p
                className={cn(
                  "mt-0.5 text-xs font-medium",
                  percentage >= 90
                    ? "text-destructive"
                    : percentage >= 70
                    ? "text-yellow-600 dark:text-yellow-500"
                    : "text-muted-foreground"
                )}
              >
                {100 - percentage}% remaining
              </p>
            </div>
          </ItemHeader>

          <ItemFooter className="justify-start">
            <div className="w-full">
              <Progress
                value={percentage}
                className="bg-muted"
                indicatorClassName={getUsageColor(percentage)}
              />
            </div>
          </ItemFooter>
        </ItemContent>
      </Item>
    </section>
  );
}

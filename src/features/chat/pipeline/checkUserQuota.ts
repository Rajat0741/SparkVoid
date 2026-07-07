import { AppError } from "@/utils/app-error";
import { getUsageByUserId, insertUsageIfNotExists } from "@/lib/db/queries";
import { getFormattedTimeUntilNextReset } from "@/utils/time";
import { DAILY_CAP } from "@/constants";

export async function getUsage(userId: string) {
  const existing = await getUsageByUserId(userId);
  if (existing) return existing;
  return (
    (await insertUsageIfNotExists(userId)) ?? (await getUsageByUserId(userId))
  );
}

export const checkUserQuota = async (userId: string) => {
  const usage = await getUsage(userId);
  if (usage.tokensUsed > DAILY_CAP) {
    const formatted = getFormattedTimeUntilNextReset();
    throw new AppError(
      `You've reached your daily limit of ${DAILY_CAP.toLocaleString("en-US", { notation: "compact" })} tokens. Your usage resets in ${formatted}.`,
      429,
    );
  }
  return usage;
};

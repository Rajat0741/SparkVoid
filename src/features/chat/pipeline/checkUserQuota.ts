import { AppError } from "@/utils/app-error";
import { recordAndGetUsage } from "@/lib/db/queries";
import { getFormattedTimeUntilNextReset } from "@/utils/time";

export const checkUserQuota = async (userId: string) => {
  const usage = await recordAndGetUsage(userId, 0);
  
  if (usage.tokensUsed > 100000) {
    const formatted = getFormattedTimeUntilNextReset();

    throw new AppError(
      `You've reached your daily limit of 100,000 tokens. Your usage resets in ${formatted}.`,
      429,
    );
  }

  return usage;
};

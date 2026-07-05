import { intervalToDuration, formatDuration } from "date-fns";

/**
 * Calculates the exact duration until the next midnight in the Asia/Kolkata timezone
 * and formats it into a human-readable string like "4 hours 20 minutes".
 */
export function getFormattedTimeUntilNextReset(): string {
  const now = Date.now();
  const target = new Date();
  target.setUTCHours(18, 30, 0, 0);
  if (target.getTime() <= now) target.setUTCDate(target.getUTCDate() + 1);

  const ms = Math.ceil((target.getTime() - now) / 60000) * 60000;
  const duration = intervalToDuration({ start: 0, end: ms });
  return formatDuration(duration, { format: ["hours", "minutes"] }) || "0 minutes";
}

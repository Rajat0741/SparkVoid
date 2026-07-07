import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";

export const userUsage = pgTable("user_usage", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  tokensUsed: integer("tokens_used").notNull().default(0),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userUsageRelations = relations(userUsage, ({ one }) => ({
  user: one(user, {
    fields: [userUsage.userId],
    references: [user.id],
  }),
}));

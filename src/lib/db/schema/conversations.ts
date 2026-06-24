import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const conversations = pgTable('conversations', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').notNull(),
  title:     text('title').notNull(),
  isShared:  boolean('is_shared').notNull().default(false),
  isPinned:  boolean('is_pinned').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [
  index('conversations_sidebar_idx').on(t.userId, t.isPinned, t.updatedAt),
]);

export const conversationsInsertSchema = createInsertSchema(conversations);
export const conversationsSelectSchema = createSelectSchema(conversations);

export type ConversationType = z.infer<typeof conversationsSelectSchema>;
export type NewConversationType = z.infer<typeof conversationsInsertSchema>;

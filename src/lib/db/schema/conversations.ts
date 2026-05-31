import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const conversations = pgTable('conversations', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').notNull(),
  title:     text('title').notNull(),
  isShared:  boolean('is_shared').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const conversationsInsertSchema = createInsertSchema(conversations);
export const conversationsSelectSchema = createSelectSchema(conversations);

export type ConversationType = z.infer<typeof conversationsSelectSchema>;
export type NewConversationType = z.infer<typeof conversationsInsertSchema>;

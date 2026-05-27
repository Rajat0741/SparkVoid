import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const conversations = pgTable('conversations', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').notNull(),
  title:     text('title').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

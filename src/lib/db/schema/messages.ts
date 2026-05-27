import { MetadataType } from '@/types';
import { UIDataTypes, UIMessagePart, UITools } from 'ai';
import { pgTable, text, timestamp, pgEnum, jsonb, index } from 'drizzle-orm/pg-core';
import { conversations } from './conversations';

export const roleEnum = pgEnum('role', ['system', 'user', 'assistant']);

export const messages = pgTable('messages', {
  id:             text('id').primaryKey(),
  conversationId: text('conversation_id').notNull().references(() => conversations.id),
  role:           roleEnum('role').notNull(),
  metadata:       jsonb('metadata').$type<MetadataType>(),
  parts:          jsonb('parts').notNull().default([]).$type<UIMessagePart<UIDataTypes, UITools>>(),
  createdAt:      timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  index('messages_conversation_id_idx').on(t.conversationId),
]);

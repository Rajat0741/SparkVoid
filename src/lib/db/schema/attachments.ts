import { pgTable, text, timestamp, integer, pgEnum, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { conversations } from './conversations';
import { messages } from './messages';

export const attachmentStatusEnum = pgEnum('attachment_status', ['pending', 'attached']);

export const attachments = pgTable(
  'attachments',
  {
    id:             text('id').primaryKey(),
    conversationId: text('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }),
    messageId:      text('message_id').references(() => messages.id, { onDelete: 'cascade' }),
    userId:         text('user_id').notNull(),
    status:         attachmentStatusEnum('status').notNull().default('pending'),
    fileName:       text('file_name').notNull(),
    fileType:       text('file_type').notNull(),
    fileSize:       integer('file_size').notNull(),
    imagekitFileId: text('imagekit_file_id').notNull(),
    url:            text('url').notNull(),
    thumbnailUrl:   text('thumbnail_url'),
    createdAt:      timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('attachments_conversation_status_idx').on(t.conversationId, t.status),
    index('attachments_message_status_idx').on(t.messageId, t.status),
    index('attachments_user_status_idx').on(t.userId, t.status),
    index('attachments_imagekit_file_id_idx').on(t.imagekitFileId),
    index('attachments_url_idx').on(t.url),
  ]
);

export const attachmentsInsertSchema = createInsertSchema(attachments);
export const attachmentsSelectSchema = createSelectSchema(attachments);

export type AttachmentType    = z.infer<typeof attachmentsSelectSchema>;
export type NewAttachmentType = z.infer<typeof attachmentsInsertSchema>;

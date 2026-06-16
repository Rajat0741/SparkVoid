import { z } from "zod";

const MetadataSchema = z.object({
  tokens: z.number().optional(),
});

export const CustomUIMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  parts: z.array(z.unknown()),
  metadata: MetadataSchema.optional(),
});

export const RequestSchema = z.object({
  conversationId: z.string(),
  message: CustomUIMessageSchema,
});

export type RequestSchemaType = z.infer<typeof RequestSchema>;
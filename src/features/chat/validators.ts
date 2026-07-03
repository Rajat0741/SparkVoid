import { z } from "zod";

const MetadataSchema = z.object({
  totalTokens: z.number().optional(),
  model: z.enum(["spark", "void"]).optional(),
});

export const CustomUIMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  parts: z.array(z.unknown()),
  metadata: MetadataSchema.optional(),
});

export type ModelId = "spark" | "void";

export const RequestSchema = z.object({
  conversationId: z.string(),
  message: CustomUIMessageSchema,
  model: z.enum(["spark", "void"]).optional(),
});

export type RequestSchemaType = z.infer<typeof RequestSchema>;

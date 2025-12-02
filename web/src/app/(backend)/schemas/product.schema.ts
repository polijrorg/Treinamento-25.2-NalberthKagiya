import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();
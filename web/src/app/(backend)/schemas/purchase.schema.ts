import { z } from "zod";

export const createPurchaseSchema = z.object({
  productIds: z.array(z.string()).min(1),
});

export const checkoutSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    quantity: z.number().int().min(1)
  }))
});
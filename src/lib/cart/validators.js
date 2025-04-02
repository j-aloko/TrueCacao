import * as z from 'zod';

export const cartItemSchema = z.object({
  attributes: z.record(z.any()).optional(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive().max(100),
});

export const cartDiscountSchema = z.object({
  code: z.string().min(3).max(20),
});

export const cartGiftCardSchema = z.object({
  code: z.string().min(10).max(20),
});

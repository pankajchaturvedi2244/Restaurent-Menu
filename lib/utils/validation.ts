import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  country: z.string().min(2, 'Valid country name required'),
});

export const VerifyCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Code must be 6 digits'),
});

export const RestaurantSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
});

export const DishSchema = z.object({
  name: z.string().min(2, 'Dish name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().url('Image must be a valid URL'),
  spiceLevel: z.number().min(0).max(5).optional(),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  type: z.enum(['veg', 'non-veg']).optional(),
  sellingRate : z.number().min(1, 'Selling rate must be a positive number'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type VerifyCodeInput = z.infer<typeof VerifyCodeSchema>;
export type RestaurantInput = z.infer<typeof RestaurantSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
export type DishInput = z.infer<typeof DishSchema>;

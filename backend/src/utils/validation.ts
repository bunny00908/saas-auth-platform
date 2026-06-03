import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const mobileSearchSchema = z.object({
  number: z.string().regex(/^\d{10}$/, 'Must be 10-digit number'),
});

export const vehicleSearchSchema = z.object({
  number: z.string().regex(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, 'Invalid Indian vehicle number format'),
});

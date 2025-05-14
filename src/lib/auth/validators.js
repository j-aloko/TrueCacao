import { z } from 'zod';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const registerSchema = z.object({
  email: z.string().regex(emailRegex, 'Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z
    .string()
    .regex(
      passwordRegex,
      'Password must contain at least 8 characters, one uppercase, one lowercase and one number'
    ),
});

export const loginSchema = z.object({
  email: z.string().regex(emailRegex, 'Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const passwordResetSchema = z.object({
  email: z.string().regex(emailRegex, 'Invalid email format'),
});

export const newPasswordSchema = z.object({
  password: z
    .string()
    .regex(
      passwordRegex,
      'Password must contain at least 8 characters, one uppercase, one lowercase and one number'
    ),
  token: z.string().min(1, 'Token is required'),
});

export async function validateRegistration(request) {
  const body = await request.json();
  return registerSchema.parse(body);
}

export async function validateLogin(request) {
  const body = await request.json();
  return loginSchema.parse(body);
}

export async function validatePasswordReset(request) {
  const body = await request.json();
  return passwordResetSchema.parse(body);
}

export async function validateNewPassword(request) {
  const body = await request.json();
  return newPasswordSchema.parse(body);
}

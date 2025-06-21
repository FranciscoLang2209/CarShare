import { z } from 'zod';
import { VALIDATION_RULES } from '@/constants/app';

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_RULES.EMAIL.REQUIRED)
    .email(VALIDATION_RULES.EMAIL.INVALID),
  password: z
    .string()
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, VALIDATION_RULES.PASSWORD.TOO_SHORT),
});

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.NAME.MIN_LENGTH, VALIDATION_RULES.NAME.TOO_SHORT)
    .trim(),
  email: z
    .string()
    .min(1, VALIDATION_RULES.EMAIL.REQUIRED)
    .email(VALIDATION_RULES.EMAIL.INVALID),
  password: z
    .string()
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, VALIDATION_RULES.PASSWORD.TOO_SHORT),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;

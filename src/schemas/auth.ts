import { z } from 'zod';
import { VALIDATION_RULES } from '@/constants/app';

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_RULES.EMAIL.REQUIRED)
    .email(VALIDATION_RULES.EMAIL.INVALID)
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, VALIDATION_RULES.PASSWORD.REQUIRED)
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, VALIDATION_RULES.PASSWORD.TOO_SHORT),
});

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(1, VALIDATION_RULES.NAME.REQUIRED)
    .min(VALIDATION_RULES.NAME.MIN_LENGTH, VALIDATION_RULES.NAME.TOO_SHORT)
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .trim(),
  email: z
    .string()
    .min(1, VALIDATION_RULES.EMAIL.REQUIRED)
    .email(VALIDATION_RULES.EMAIL.INVALID)
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, VALIDATION_RULES.PASSWORD.REQUIRED)
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, VALIDATION_RULES.PASSWORD.TOO_SHORT)
    .max(50, 'La contraseña no puede tener más de 50 caracteres'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;

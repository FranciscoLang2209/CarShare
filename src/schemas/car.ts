import { z } from "zod";

export const CarSchema = z.object({
  model: z.string()
    .min(1, "El modelo es requerido")
    .max(50, "El modelo no puede tener más de 50 caracteres"),
  brand: z.string()
    .min(1, "La marca es requerida")
    .max(30, "La marca no puede tener más de 30 caracteres"),
  year: z.number()
    .min(1900, "El año debe ser mayor a 1900")
    .max(new Date().getFullYear() + 1, "El año no puede ser mayor al año actual"),
  consumedFuel: z.number()
    .min(0, "El combustible consumido no puede ser negativo")
    .optional()
    .default(0),
  users: z.array(z.string())
    .optional()
    .default([]),
});

export type CarFormData = z.infer<typeof CarSchema>;

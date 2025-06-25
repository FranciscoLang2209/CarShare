import { z } from "zod";

export const CarSchema = z.object({
  model: z.string()
    .min(1, "El modelo es requerido")
    .max(50, "El modelo no puede tener más de 50 caracteres")
    .trim(),
  brand: z.string()
    .min(1, "La marca es requerida")
    .max(30, "La marca no puede tener más de 30 caracteres")
    .trim(),
  year: z.number()
    .min(1900, "El año debe ser mayor a 1900")
    .max(new Date().getFullYear() + 1, "El año no puede ser mayor al año actual"),
  fuelEfficiency: z.number()
    .min(1, "La eficiencia de combustible debe ser mayor a 1 km/l")
    .max(50, "La eficiencia de combustible no puede ser mayor a 50 km/l")
    .default(11.5),
  fuelType: z.enum(['Nafta Super', 'Nafta Premium', 'Diesel'], {
    required_error: "El tipo de combustible es obligatorio",
    invalid_type_error: "Tipo de combustible inválido"
  }).default('Nafta Super'),
  users: z.array(z.string())
    .default([]),
  admin: z.string().optional(), // Admin user ID - optional for form validation
});

export type CarFormData = z.infer<typeof CarSchema>;

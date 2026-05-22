// Tipos para valoraciones - QR Restaurante

import { z } from 'zod';

export const createValoracionSchema = z.object({
  restauranteId: z.string().min(1, 'restauranteId es requerido'),
  puntuacion: z
    .number()
    .int('La puntuación debe ser un número entero')
    .min(1, 'La puntuación mínima es 1')
    .max(5, 'La puntuación máxima es 5'),
  comentario: z
    .string()
    .max(500, 'El comentario no puede superar los 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type CreateValoracionInput = z.infer<typeof createValoracionSchema>;

export interface ValoracionPublico {
  id: string;
  puntuacion: number;
  comentario: string | null;
  timestamp: string;
  cliente: { id: string; nombre: string };
}

export interface CreateValoracionAPIResponse {
  success: boolean;
  message: string;
  data?: {
    valoracion: ValoracionPublico & { restauranteId: string };
  };
}

// GET /api/restaurantes/[id]/valoraciones — pública
export interface ValoracionesPublicasResponse {
  success: boolean;
  message: string;
  data?: {
    valoraciones: ValoracionPublico[];
    valoracionMedia: number;
    totalValoraciones: number;
  };
}

// GET /api/cliente/valoraciones/mias — protegida (CLIENTE)
export interface ValoracionesMiasResponse {
  success: boolean;
  message: string;
  data?: {
    restaurantesIds: string[];
  };
}

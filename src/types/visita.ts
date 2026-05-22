// Tipos para visitas - QR Restaurante
import { z } from 'zod';

// --- Zod Schemas ---

export const registrarEntradaSchema = z.object({
  codigoQRUuid: z.string().min(1, 'El UUID del código QR es requerido'),
  firma: z.string().min(1, 'La firma HMAC es requerida'),
  acompanantes: z
    .number()
    .int('Debe ser un número entero')
    .min(0, 'Mínimo 0 acompañantes')
    .max(10, 'Máximo 10 acompañantes')
    .default(0),
});

export const registrarSalidaSchema = z.object({}).optional();

// --- TypeScript Types ---

export type CrearVisitaEntryBody = z.infer<typeof registrarEntradaSchema>;

export interface VisitaPublico {
  id: string;
  timestampEntrada: string;
  timestampSalida: string | null;
  duracionMinutos: number | null;
  estado: string;
  acompanantes: number;
  restaurante: { id: string; nombre: string };
  codigoQR: { uuid: string; idMesa: string };
}

export interface VisitaAPIResponse {
  success: boolean;
  message: string;
  data?: {
    visita?: VisitaPublico;
    ocupacion?: OcupacionData;
  };
}

export interface VisitasListResponse {
  success: boolean;
  message: string;
  data?: {
    visitas: VisitaPublico[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface VisitasResponse {
  success: boolean;
  message: string;
  data?: {
    visitas: VisitaPublico[];
  };
}

export interface OcupacionData {
  restauranteId: string;
  capacidadMaxima: number;
  ocupacionActual: number;
  plazasDisponibles: number | null;
  visitasActivas: number;
  porcentajeOcupacion: number;
  alerta80: boolean;
  alerta100: boolean;
}

export interface OcupacionResponse {
  success: boolean;
  message: string;
  data?: {
    ocupacion: OcupacionData;
  };
}

export interface AforoExcedidoError {
  success: false;
  message: string;
  data?: {
    ocupacion: OcupacionData;
  };
}

// Tipos para valoraciones - QR Restaurante

export interface ValoracionPublico {
  id: string;
  puntuacion: number;
  comentario: string | null;
  timestamp: string;
  cliente: { id: string; nombre: string };
}

export interface ValoracionesResponse {
  success: boolean;
  message: string;
  data?: {
    valoraciones: ValoracionPublico[];
  };
}

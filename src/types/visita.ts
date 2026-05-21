// Tipos para visitas - QR Restaurante

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

export interface VisitasResponse {
  success: boolean;
  message: string;
  data?: {
    visitas: VisitaPublico[];
  };
}

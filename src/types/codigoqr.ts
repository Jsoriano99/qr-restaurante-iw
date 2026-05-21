// Tipos para códigos QR - QR Restaurante

export interface CodigoQRPublico {
  uuid: string;
  idMesa: string;
  activo: boolean;
  fechaCreacion: string;
  fechaExpiracion: string | null;
}

export interface CodigosQRResponse {
  success: boolean;
  message: string;
  data?: {
    codigos: CodigoQRPublico[];
  };
}

export interface CodigoQRAPIResponse {
  success: boolean;
  message: string;
  data?: {
    codigo: CodigoQRPublico;
    imagenSvg?: string;
  };
}

// Tipos para restaurantes - QR Restaurante

export interface RestaurantePublico {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  horarios: string | null;
  tipoCocina: string;
  capacidadMaxima: number;
  horarioApertura: string | null;
  horarioCierre: string | null;
  latitud: number | null;
  longitud: number | null;
}

export interface RestauranteDetalle extends RestaurantePublico {
  ocupacionActual: number;
  plazasDisponibles: number;
  valoracionMedia: number;
  totalValoraciones: number;
  codigosQR: { uuid: string; idMesa: string; activo: boolean }[];
}

export interface RestaurantesResponse {
  success: boolean;
  message: string;
  data?: {
    restaurantes: RestaurantePublico[];
  };
}

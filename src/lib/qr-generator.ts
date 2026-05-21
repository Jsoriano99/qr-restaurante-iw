// Generación de QR en SVG - QR Restaurante

import qrcode from 'qrcode';

export async function generateQRSvg(
  uuid: string,
  idMesa: string,
  firma: string,
  fechaExpiracion?: string
): Promise<string> {
  const payload = {
    uuid,
    idMesa,
    firma,
    expiracion: fechaExpiracion || null,
  };

  const payloadJson = JSON.stringify(payload);

  return qrcode.toString(payloadJson, {
    type: 'svg',
    margin: 2,
    width: 300,
    color: {
      dark: '#000',
      light: '#FFF',
    },
  });
}

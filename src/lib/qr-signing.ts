// Firma HMAC para códigos QR - QR Restaurante

import crypto from 'crypto';

export interface QRSigningPayload {
  uuid: string;
  idMesa: string;
  fechaExpiracion?: string;
}

function getSecret(secret?: string): string {
  return secret || process.env.QR_HMAC_SECRET || process.env.NEXTAUTH_SECRET || '';
}

export function signQR(payload: QRSigningPayload, secret?: string): string {
  const hmac = crypto.createHmac('sha256', getSecret(secret));
  hmac.update(JSON.stringify(payload));
  return hmac.digest('base64');
}

export function verifyQR(payload: QRSigningPayload, firma: string, secret?: string): boolean {
  const expected = signQR(payload, secret);
  const expectedBuffer = Buffer.from(expected);
  const firmaBuffer = Buffer.from(firma);

  if (expectedBuffer.length !== firmaBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, firmaBuffer);
}

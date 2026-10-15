import CryptoJS from 'crypto-js';

export const ESEWA_SANDBOX_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
export const DEFAULT_ESEWA_MERCHANT_CODE = 'EPAYTEST';
export const DEFAULT_ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q';

/**
 * Generates an HMAC-SHA256 signature in Base64 format as required by eSewa ePay v2.
 * The input string format: `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`
 */
export function generateEsewaSignature(
  totalAmount: number,
  transactionUuid: string,
  productCode: string
): string {
  const secretKey = process.env.ESEWA_SECRET_KEY || DEFAULT_ESEWA_SECRET_KEY;
  const signatureData = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  const hash = CryptoJS.HmacSHA256(signatureData, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
}

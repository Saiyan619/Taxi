import crypto from 'crypto';

/**
 * Generates a highly secure, random token string for email verification.
 * @returns A 64-character random hexadecimal string.
 */
export const generateVerificationToken = (): string => {
  // 32 bytes of random data converts into a 64-character hex string
  return crypto.randomBytes(32).toString('hex');
};

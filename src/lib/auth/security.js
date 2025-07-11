import 'dotenv/config';
import crypto, { randomBytes, createHash } from 'crypto';

import bcrypt from 'bcryptjs';
// Security configurations
const SALT_ROUNDS = 12;

const { ENCRYPTION_SECRET } = process.env; // 32 chars
const IV_LENGTH = 16;

// Password hashing
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Token generation
export async function generateToken() {
  return randomBytes(32).toString('hex');
}

export async function generateHash(token) {
  return createHash('sha256').update(token).digest('hex');
}

const deriveKey = (secret) =>
  crypto.createHash('sha256').update(secret).digest();

export async function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(ENCRYPTION_SECRET);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export async function decrypt(text) {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const key = deriveKey(ENCRYPTION_SECRET);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

import 'dotenv/config';
import { randomBytes, createHash } from 'crypto';

import bcrypt from 'bcryptjs';
// Security configurations
const SALT_ROUNDS = 12;

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

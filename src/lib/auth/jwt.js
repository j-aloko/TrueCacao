import jwt from 'jsonwebtoken';
import 'dotenv/config';

export async function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
}

export async function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: '7d',
  });
}

export async function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export async function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_SECRET);
}

export async function createSessionTokens(user, session) {
  const payload = {
    role: user.role,
    sessionId: session.id,
    userId: user.id,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

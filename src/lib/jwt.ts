import jwt, { sign } from "jsonwebtoken";

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_AT!);
  } catch {
    return null;
  }
}

export function generateAccessToken(payload: object) {
  return sign(payload, process.env.JWT_SECRET_AT!, {
    expiresIn: process.env.JWT_EXPIRY_AT,
  });
}

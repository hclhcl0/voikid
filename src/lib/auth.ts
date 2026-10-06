// =============================================
// VocaKids – Auth Library
// JWT signing/verification + bcrypt password hashing
// Dùng cho hệ thống đăng ký/đăng nhập cá nhân
// =============================================

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

// ── Constants ─────────────────────────────────────────────────────────────────
export const AUTH_COOKIE_NAME = 'vocakids_auth_token';
export const JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const BCRYPT_SALT_ROUNDS = 12;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || process.env.VOCAKIDS_ADMIN_PASSWORD || 'vocakids-dev-secret-change-in-production';
  return secret;
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface JWTPayload {
  role?: 'admin' | 'parent' | 'student';
  accountId: string;
  email: string;
  displayName: string;
  iat?: number;
  exp?: number;
}

export interface AuthAccount {
  id: string;
  email: string;
  displayName: string;
  adminPin: string;
  accountType: 'registered';
  createdAt: string;
}

// ── Password Helpers ──────────────────────────────────────────────────────────
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

// ── JWT Helpers ───────────────────────────────────────────────────────────────
export function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRY_SECONDS });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
  } catch {
    return null;
  }
}

// ── Cookie Helpers ────────────────────────────────────────────────────────────
export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: JWT_EXPIRY_SECONDS,
    path: '/',
  });
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export function getAuthTokenFromRequest(req: NextRequest): string | null {
  // 1. Check HttpOnly cookie (preferred, most secure)
  const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;

  // 2. Fallback: Authorization header (for API clients)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
}

export function getAccountFromRequest(req: NextRequest): JWTPayload | null {
  const token = getAuthTokenFromRequest(req);
  if (!token) return null;
  return verifyJWT(token);
}

// ── UUID Generator ────────────────────────────────────────────────────────────
export function generateId(): string {
  // Simple UUID v4 compatible (works in Node.js without crypto.randomUUID polyfill issues)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ── Input Validation ──────────────────────────────────────────────────────────
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }
  if (password.length > 128) {
    return { valid: false, message: 'Mật khẩu quá dài (tối đa 128 ký tự)' };
  }
  return { valid: true, message: '' };
}

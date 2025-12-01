import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

export interface SessionPayload {
  userId: string;
  email: string;
}

export async function createSession(userId: string, email: string) {
  const payload: SessionPayload = { userId, email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
  
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

// Get session when running in server components / API routes
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) return null;
  
  try {
    const payload = jwt.verify(token, JWT_SECRET) as SessionPayload;
    return payload;
  } catch {
    return null;
  }
}

// Get session from a NextRequest (for use in middleware)
export function getSessionFromRequest(request: NextRequest): SessionPayload | null {
  const token = request.cookies.get('session')?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as SessionPayload;
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

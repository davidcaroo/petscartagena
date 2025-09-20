import jwt from 'jsonwebtoken';
import { db } from './db';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
}

export async function getUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization');
  let token = authHeader?.replace('Bearer ', '');
  
  // If no token in header, try to get from cookies
  if (!token) {
    token = request.cookies.get('auth_token')?.value;
  }
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });
    
    return user as AuthUser;
  } catch (error) {
    return null;
  }
}

// Alias for getUserFromRequest for consistency
export const getCurrentUser = getUserFromRequest;

export function requireAuth(handler: (request: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return handler(request, user);
  };
}

export function requireRole(role: 'USER' | 'OWNER' | 'ADMIN') {
  return function <T extends (request: NextRequest, user: AuthUser) => Promise<Response>>(handler: T) {
    return async (request: NextRequest) => {
      const user = await getUserFromRequest(request);
      
      if (!user) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (user.role !== role) {
        return new Response(JSON.stringify({ error: 'No tienes permisos para esta acción' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return handler(request, user);
    };
  };
}
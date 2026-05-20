// Middleware de autenticación - QR Restaurante

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret-temporal');

const publicPaths = ['/', '/login', '/register', '/api/auth/register', '/api/auth/login', '/api/auth/refresh', '/api/auth/me', '/_next', '/favicon.ico'];

const roleProtectedPaths: { path: string; roles: string[] }[] = [
  { path: '/admin', roles: ['ADMIN'] },
  { path: '/restaurante', roles: ['RESTAURANTE'] },
  { path: '/cliente', roles: ['CLIENTE'] },
  { path: '/api/admin', roles: ['ADMIN'] },
  { path: '/api/restaurante', roles: ['RESTAURANTE'] },
  { path: '/api/cliente', roles: ['CLIENTE'] },
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((path) => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    for (const protectedPath of roleProtectedPaths) {
      if (pathname.startsWith(protectedPath.path)) {
        if (!protectedPath.roles.includes(userRole)) {
          if (pathname.startsWith('/api')) {
            return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
          }
          const redirectMap: Record<string, string> = {
            ADMIN: '/admin',
            RESTAURANTE: '/restaurante',
            CLIENTE: '/cliente',
          };
          return NextResponse.redirect(new URL(redirectMap[userRole] || '/', request.url));
        }
      }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id as string);
    requestHeaders.set('x-user-role', userRole);
    requestHeaders.set('x-user-email', payload.email as string);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ success: false, message: 'Token inválido o expirado' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
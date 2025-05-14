import { NextResponse } from 'next/server';

import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from '@/lib/auth/jwt';
import { validateSession, revokeSession } from '@/lib/auth/session-service';

// Path configuration
const PUBLIC_ROUTES = new Set([
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/reset-password',
  '/api/auth',
]);

const AUTH_ROUTES = new Set(['/dashboard', '/account', '/checkout']);

const ADMIN_ROUTES = new Set(['/admin', '/api/admin']);

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const response = NextResponse.next();

  // Skip middleware for public routes
  if (isPublicRoute(path)) {
    return response;
  }

  try {
    // Authentication check
    const authResult = await handleAuthentication(request, response);

    // Role-based authorization
    if (authResult.user) {
      if (isAdminRoute(path) && authResult.user.role !== 'ADMIN') {
        return redirectToLogin(request);
      }

      if (isAuthRoute(path) && authResult.user.role === 'CUSTOMER') {
        return redirectToLogin(request);
      }

      // Add user context to headers
      response.headers.set('x-user-id', authResult.user.userId);
      response.headers.set('x-user-role', authResult.user.role);
    }

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return redirectToLogin(request);
  }
}

// Helper functions
function isPublicRoute(path) {
  return PUBLIC_ROUTES.has(path) || path.startsWith('/api/auth');
}

function isAuthRoute(path) {
  return AUTH_ROUTES.has(path) || path.startsWith('/api/private');
}

function isAdminRoute(path) {
  return ADMIN_ROUTES.has(path) || path.startsWith('/api/admin');
}

function redirectToLogin(request) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  const response = NextResponse.redirect(loginUrl);
  // Clear invalid tokens
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
}

async function handleAuthentication(request, response) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  let payload;

  // Check access token first
  if (accessToken) {
    try {
      payload = verifyAccessToken(accessToken);
      const validSession = await validateSession(
        payload.sessionId,
        payload.userId
      );

      if (validSession) {
        return { user: { role: payload.role, userId: payload.userId } };
      }
    } catch (error) {
      console.debug('Access token invalid:', error);
    }
  }

  // Attempt refresh if access token is invalid/missing
  if (refreshToken) {
    try {
      payload = verifyRefreshToken(refreshToken);
      const validSession = await validateSession(
        payload.sessionId,
        payload.userId
      );

      if (validSession) {
        const newAccessToken = generateAccessToken(payload);

        response.cookies.set('accessToken', newAccessToken, {
          httpOnly: true,
          maxAge: 900,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production', // 15 minutes
        });

        return { user: { role: payload.role, userId: payload.userId } };
      }
    } catch (error) {
      console.debug('Refresh token invalid:', error);
      // Clear invalid tokens
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      if (payload?.sessionId) {
        await revokeSession(payload.sessionId);
      }
    }
  }

  return {};
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

import { USER_ROLE } from '@prisma/client';
import { NextResponse } from 'next/server';

import { verifyAccessToken } from './jwt';

export function requireRole(requiredRole) {
  return async function handler(request) {
    try {
      const accessToken = request.cookies.get('accessToken')?.value;
      if (!accessToken) throw new Error('Missing access token');

      const payload = await verifyAccessToken(accessToken);
      const { role } = payload;

      const roleIsValid = Object.values(USER_ROLE).includes(role);
      if (!roleIsValid) throw new Error('Unauthorized');

      if (requiredRole === 'ADMIN' && role !== 'ADMIN') {
        throw new Error('Admin access required');
      }

      if (requiredRole === 'MANAGER' && role === 'CUSTOMER') {
        throw new Error('Manager access required');
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
  };
}

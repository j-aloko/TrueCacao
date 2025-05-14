import { USER_ROLE } from '@prisma/client';
import { NextResponse } from 'next/server';

export function requireRole(role) {
  return function handler(request) {
    const userRole = request.headers.get('x-user-role');

    if (!userRole || !Object.values(USER_ROLE).includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (role === 'ADMIN' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    if (role === 'MANAGER' && userRole === 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Manager access required' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
}

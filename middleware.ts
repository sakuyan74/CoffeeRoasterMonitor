import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware triggered for path:', request.nextUrl.pathname);

  const basicAuth = request.headers.get('authorization');

  console.log('Basic Auth Header:', basicAuth ? 'Present' : 'Not present');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    console.log('Auth attempt with user:', user);

    if (user === 'admin' && pwd === 'password') {
      console.log('Authentication successful');
      return NextResponse.next();
    }
  }

  console.log('Authentication failed');

  return new NextResponse('認証が必要です', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: ['/api/temperature', '/'],
};


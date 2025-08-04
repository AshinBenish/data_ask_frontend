// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const path = request.nextUrl.pathname;
    console.log("Path is : ",path)
    const isLoggedIn = !!token;
    const isProtectedPath = ['/', '/upload', '/query', '/result', '/saved-queries', '/history', '/remote-db', '/settings'].includes(path);

    // Protect private routes
    if (isProtectedPath && !isLoggedIn) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Prevent access to login if already logged in
    if ((path === '/auth/login' || path === '/auth/register') && isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/upload', '/query', '/result', '/saved-queries', '/history', '/remote-db', '/settings'], // Apply middleware only to these routes
};

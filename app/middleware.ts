import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the user is authenticated using the persistent store
    // For clientside middleware, we need to use cookies as we can't directly access the store
    const token = request.cookies.get('auth-storage');
    const isAuthenticated = token && token.value && token.value.includes('"isAuthenticated":true');

    const isLoginPage = request.nextUrl.pathname === '/login';
    const isPublicPage = ['/login', '/register'].includes(request.nextUrl.pathname);

    // If the user is authenticated and trying to access the login page, redirect to dashboard
    if (isAuthenticated && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If the user is not authenticated and trying to access a protected page, redirect to login
    if (!isAuthenticated && !isPublicPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Add a matcher for the middleware to protect specific routes
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
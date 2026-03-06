import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname: originalPathname } = request.nextUrl;
    // Normalize path by removing trailing slash for consistent matching
    const pathname = originalPathname.replace(/\/$/, '') || '/';

    // Get token from cookies
    const token = request.cookies.get('accessToken')?.value;

    // 1. Protect /admin routes (except /admin/login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Note: We don't automatically redirect away from /admin/login here 
    // because we don't know if the token belongs to an admin or a user.
    // We let the client-side handle that for a better UX.

    return NextResponse.next();
}

// Ensure middleware runs for all admin routes
export const config = {
    matcher: ['/admin/:path*'],
};

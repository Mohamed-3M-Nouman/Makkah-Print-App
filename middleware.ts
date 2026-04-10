import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
    /* SUPABASE BYPASS - MOCK CUSTOMER MIDDLEWARE */

    // 1. Check for User Role Cookie
    const userRole = request.cookies.get('user_role')?.value;
    const { pathname } = request.nextUrl;

    console.log('Middleware Check:', { pathname, userRole });

    // 2. Generic Dashboard Protection: Users must have a role to enter /home/*
    if (pathname.startsWith('/home') && !userRole) {
        console.log('Access Denied to Home. Redirecting to landing page...');
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Redirect logged-in users away from the landing page / login page
    if ((pathname === '/' || pathname === '/forgot-password') && userRole) {
        console.log('User already logged in. Redirecting to /home...');
        return NextResponse.redirect(new URL('/home', request.url));
    }

    // 4. Protect Operator Routes (Strict Role Check)
    if (pathname.startsWith('/operator') && pathname !== '/operator/login') {
        if (userRole !== 'operator') {
            console.log('Unauthorized Access to Operator Dashboard. Redirecting...');
            return NextResponse.redirect(new URL('/operator/login', request.url));
        }
    }

    // 5. Fallback to original Supabase Logic (updates session if needed)
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

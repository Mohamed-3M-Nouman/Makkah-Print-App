import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ----------------------------------------------------------------
    // 1. Create Supabase client for middleware (refreshes session tokens)
    // ----------------------------------------------------------------
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: Do not add logic between createServerClient and getUser()
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // ----------------------------------------------------------------
    // 2. Customer routes (/home/*) — require any authenticated session
    // ----------------------------------------------------------------
    // Keep backward compatibility with the mock customer flow (user_role cookie)
    const userRoleCookie = request.cookies.get("user_role")?.value;

    if (pathname.startsWith("/home") && !user && !userRoleCookie) {
        console.log("[Middleware] No session for /home. Redirecting to landing.");
        return NextResponse.redirect(new URL("/", request.url));
    }

    // ----------------------------------------------------------------
    // 3. Redirect logged-in customers away from landing/login
    // ----------------------------------------------------------------
    if ((pathname === "/" || pathname === "/forgot-password") && (user || userRoleCookie)) {
        return NextResponse.redirect(new URL("/home", request.url));
    }

    // ----------------------------------------------------------------
    // 4. Protect Operator Routes — require a real Supabase session
    // ----------------------------------------------------------------
    if (pathname.startsWith("/operator") && pathname !== "/operator/login") {
        if (!user) {
            console.log("[Middleware] No Supabase session for operator route. Redirecting to login.");
            return NextResponse.redirect(new URL("/operator/login", request.url));
        }
        // Note: Role-level check (operator vs customer) is done in the
        // operator layout/dashboard via a profiles table query, not here.
        // This keeps middleware fast and avoids an extra DB call per request.
    }

    // ----------------------------------------------------------------
    // 5. Redirect authenticated operators away from the login page
    // ----------------------------------------------------------------
    if (pathname === "/operator/login" && user) {
        return NextResponse.redirect(new URL("/operator/dashboard", request.url));
    }

    // ----------------------------------------------------------------
    // 6. Return the response (with refreshed session cookies)
    // ----------------------------------------------------------------
    return supabaseResponse;
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
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};

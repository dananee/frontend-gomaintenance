import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { proxy } from "./lib/auth-middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware({
    ...routing,
    localeDetection: false // Force it to respect the route locale FIRST
});

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Handle Assets and Public routes logic...
    // But actually, intlMiddleware handles its own matching.

    // 2. Run Internationalization Middleware FIRST
    // This establishes the locale context (sets x-next-intl-locale headers in response)
    const intlResponse = intlMiddleware(request);

    // If intlMiddleware wants to redirect (e.g. /dashboard -> /en/dashboard), return it immediately
    if (intlResponse.headers.get("Location")) {
        return intlResponse;
    }

    // 3. Run Auth Middleware (proxy.ts logic)
    // We pass the request to proxy.
    const authResponse = await proxy(request);

    // If auth redirects (e.g. to login), return that response
    // We should preserve any locale-related cookies/headers from intlResponse if possible,
    // but usually a redirect to login will trigger intlMiddleware again on the next request.
    if (authResponse.status !== 200 && authResponse.headers.get("Location")) {
        return authResponse;
    }

    // 4. Merge Responses
    // authResponse.headers (like x-user-id) must be added to intlResponse
    authResponse.headers.forEach((value: string, key: string) => {
        intlResponse.headers.set(key, value);
    });

    return intlResponse;
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        "/((?!api|_next|_vercel|.*\\..*).*)",
        // However, match all pathnames within `/users`, optionally with a locale prefix
        // "/([\\w-]+)?/users/(.+)"
    ],
};

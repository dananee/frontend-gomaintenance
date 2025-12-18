import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define role type to match backend
type Role = "admin" | "manager" | "technician" | "viewer";

// JWT Claims structure matching backend
interface JWTPayload {
  user_id: string;
  tenant_id: string;
  email: string;
  role: Role;
  exp: number;
  iat: number;
}

// Route access rules matching routeAccess.ts
interface AccessRule {
  pattern: RegExp;
  roles: Role[];
}

const routeAccessRules: AccessRule[] = [
  {
    pattern: /^\/dashboard\/?$/,
    roles: ["admin", "manager", "technician", "viewer"],
  },
  {
    pattern: /^\/dashboard\/users/,
    roles: ["admin"],
  },
  {
    pattern: /^\/dashboard\/reports/,
    roles: ["admin", "manager"],
  },
  {
    pattern: /^\/dashboard\/work-orders/,
    roles: ["admin", "manager", "technician"],
  },
  {
    pattern: /^\/dashboard\/inventory/,
    roles: ["admin", "manager"],
  },
  {
    pattern: /^\/dashboard\/vehicles/,
    roles: ["admin", "manager", "viewer", "technician"],
  },
  {
    pattern: /^\/dashboard\/maintenance/,
    roles: ["admin", "manager", "technician"],
  },
  {
    pattern: /^\/dashboard\/notifications/,
    roles: ["admin", "manager", "technician", "viewer"],
  },
  {
    pattern: /^\/dashboard\/search/,
    roles: ["admin", "manager", "technician", "viewer"],
  },
  {
    pattern: /^\/dashboard\/settings\/(profile|notifications)/,
    roles: ["admin", "manager", "technician", "viewer"],
  },
  {
    pattern: /^\/dashboard\/settings\/(company|branding|roles|integrations)/,
    roles: ["admin"],
  },
  {
    pattern: /^\/dashboard\/settings$/, // Main settings page
    roles: ["admin", "manager", "technician", "viewer"],
  },
  {
    pattern: /^\/dashboard\//,
    roles: ["admin"], // Fallback: only admins can access unlisted routes
  },
];

// Public routes that don't require authentication
const publicRoutes = ["/login", "/not-authorized", "/forbidden", "/not-found"];

// Check if route is allowed for the given role
function isRouteAllowed(pathname: string, role: Role | undefined): boolean {
  if (!role) return false;

  const matchingRule = routeAccessRules.find((rule) =>
    rule.pattern.test(pathname)
  );

  if (!matchingRule) {
    return role === "admin"; // Fallback: only admins can access unlisted routes
  }

  return matchingRule.roles.includes(role);
}

// Verify JWT token
async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );

    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Helper to strip locale from pathname
function getPathnameWithoutLocale(pathname: string): string {
  const localePattern = /^\/(?:en|fr|ar)(?:\/|$)/;
  const newPath = pathname.replace(localePattern, "/");
  return newPath === "" ? "/" : newPath;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);

  // Allow public routes
  // We check against both the raw pathname and the locale-stripped pathname
  // This ensures /fr/login works as well as /login (if visited directly)
  if (publicRoutes.includes(pathnameWithoutLocale)) {
    return NextResponse.next();
  }

  // Get token from cookies (primary) or fallback to checking if user might be authenticated
  const token = request.cookies.get("auth_token")?.value;

  // Root path handling
  if (pathnameWithoutLocale === "/") {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protected routes (dashboard and API routes)
  // For API routes, we don't strip locale because they don't have it (usually)
  // But our previous check was: pathname.startsWith("/dashboard")
  if (pathnameWithoutLocale.startsWith("/dashboard") || (pathname.startsWith("/api") && !pathname.startsWith("/api/auth"))) {
    // Redirect to login if no token
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname); // Keep original path for redirect back
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
      // Invalid token - clear cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    // For dashboard routes, check role-based access
    if (pathnameWithoutLocale.startsWith("/dashboard")) {
      const allowed = isRouteAllowed(pathnameWithoutLocale, payload.role);
      if (!allowed) {
        return NextResponse.redirect(new URL("/not-authorized", request.url));
      }
    }

    // Add user info to headers for downstream use
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.user_id);
    response.headers.set("x-user-role", payload.role);
    response.headers.set("x-tenant-id", payload.tenant_id);
    response.headers.set("Authorization", `Bearer ${token}`);
    return response;
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

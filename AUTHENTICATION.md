# Authentication Middleware Setup

## Overview

This application now uses Next.js middleware for **server-side authentication** and **role-based access control (RBAC)**. This provides enhanced security that cannot be bypassed by disabling JavaScript or manipulating client-side code.

## Key Features

✅ **Server-side route protection** - Middleware runs before pages load  
✅ **JWT token validation** - Verifies tokens using jose library  
✅ **HttpOnly cookies** - Tokens stored in secure, httpOnly cookies  
✅ **Role-based access control** - Different routes for different user roles  
✅ **Automatic redirects** - Unauthenticated users redirected to login  

## Environment Configuration

### Required Environment Variable

Add the following to your `.env.local` file:

```bash
# JWT Secret (must match backend JWT_SECRET)
JWT_SECRET=your-secret-key-here
```

**IMPORTANT**: The `JWT_SECRET` must be **exactly the same** as the secret used by your backend API. This is required for the middleware to validate JWT tokens.

## How It Works

### 1. Authentication Flow

```
User Login → API Call → Backend Returns JWT → 
Set HttpOnly Cookie + localStorage → Redirect to Dashboard
```

### 2. Route Protection

The middleware (`src/middleware.ts`) intercepts all requests and:

1. Checks for `auth_token` cookie
2. Validates JWT token signature and expiration
3. Extracts user role from token payload
4. Verifies user has permission for the requested route
5. Redirects if unauthorized or unauthenticated

### 3. Protected Routes

| Route Pattern | Allowed Roles |
|--------------|---------------|
| `/dashboard` | admin, manager, technician, viewer |
| `/dashboard/users` | admin |
| `/dashboard/reports` | admin, manager |
| `/dashboard/work-orders` | admin, manager, technician |
| `/dashboard/inventory` | admin, manager |
| `/dashboard/vehicles` | admin, manager, viewer, technician |
| `/dashboard/maintenance` | admin, manager, technician |
| `/dashboard/settings` | admin |

### 4. Public Routes

These routes are accessible without authentication:
- `/login`
- `/not-authorized`
- `/forbidden`
- `/not-found`

## Security Improvements

### Before (Client-side only)
❌ Authentication checks in `useEffect` (runs after page load)  
❌ Tokens in localStorage only (accessible to JavaScript)  
❌ Can be bypassed by disabling JavaScript  
❌ Flash of unauthorized content before redirect  

### After (Server-side + Client-side)
✅ Middleware checks before page loads  
✅ HttpOnly cookies (not accessible to JavaScript)  
✅ Cannot be bypassed - runs on server  
✅ No flash of content - redirect happens server-side  

## Files Changed

### New Files
- `src/middleware.ts` - Main authentication middleware
- `src/app/api/auth/set-cookie/route.ts` - API route for cookie management

### Modified Files
- `src/features/auth/hooks/useLogin.ts` - Sets cookies on login
- `src/store/useAuthStore.ts` - Clears cookies on logout
- `src/components/layout/RoleBasedLayout.tsx` - Simplified (no auth checks)
- `src/app/page.tsx` - Simplified (no redirect logic)

## Testing

After implementing these changes, test the following scenarios:

1. **Unauthenticated access**: Navigate to `/dashboard` → Should redirect to `/login`
2. **Login flow**: Login with valid credentials → Should redirect to `/dashboard` and set cookies
3. **Authenticated access**: While logged in, navigate to `/login` → Should redirect to `/dashboard`
4. **Role-based access**: As technician, try to access `/dashboard/users` → Should redirect to `/not-authorized`
5. **Logout**: Click logout → Should clear cookies and redirect to `/login`
6. **Token expiration**: Delete `auth_token` cookie → Should redirect to `/login` on next navigation

## Troubleshooting

### Issue: Middleware not running
- Check that `src/middleware.ts` exists in the correct location
- Verify the `config.matcher` pattern in middleware.ts
- Restart the Next.js dev server

### Issue: "Invalid token" errors
- Verify `JWT_SECRET` in `.env.local` matches backend secret
- Check that backend is generating valid JWT tokens
- Inspect token payload in browser DevTools → Application → Cookies

### Issue: Infinite redirect loop
- Check that `/login` is in the `publicRoutes` array
- Verify middleware is not trying to protect `/login` route
- Clear all cookies and localStorage, then try again

## Notes

- Users will need to **log in again** after this update (tokens moved to cookies)
- The middleware uses the `jose` library (built into Next.js) for JWT verification
- Tokens are stored in both cookies (for middleware) and localStorage (for client-side API calls)

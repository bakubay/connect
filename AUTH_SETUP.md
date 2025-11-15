# Authentication & Routing Setup

This document explains how authentication and routing are configured in this application.

## Overview

This application uses:
- **TanStack Router** for type-safe, file-based routing
- **Convex Auth** for authentication
- **React** with TypeScript for the frontend

## Route Structure

### Public Routes (No authentication required)
- `/` - Home page
- `/signin` - Sign in/Sign up page

### Protected Routes (Authentication required)
- `/dashboard` - User dashboard with todos

## How It Works

### Authentication Components

The app uses Convex's built-in components and Convex Auth hooks:

```tsx
// Import auth UI components from convex/react
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"

// Import auth actions from @convex-dev/auth/react
import { useAuthActions } from "@convex-dev/auth/react"

// Show content only to authenticated users
<Authenticated>
  <DashboardContent />
</Authenticated>

// Show content only to unauthenticated users
<Unauthenticated>
  <SignInForm />
</Unauthenticated>

// Show loading state during auth check
<AuthLoading>
  <Spinner />
</AuthLoading>

// Sign in/out actions
const { signIn, signOut } = useAuthActions()
```

### Protected Routes

Protected routes use the `<Authenticated>` wrapper with automatic redirects:

```tsx
// src/routes/dashboard.tsx
export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
      <Authenticated>
        {/* Protected content here */}
      </Authenticated>
    </>
  )
}
```

### Sign In Flow

1. User visits `/signin`
2. User enters email and password
3. Click "Sign up" to create account or "Sign in" to login
4. On success, redirects to `/dashboard`
5. If already authenticated, `/signin` redirects to `/dashboard`

### Sign Out Flow

1. User clicks "Sign Out" in the navigation
2. Convex Auth clears the session
3. User is automatically shown unauthenticated UI
4. Can navigate back to `/signin` to sign in again

## Navigation

The `Header` component adapts based on authentication state:

- **Unauthenticated**: Shows "Sign In" link
- **Authenticated**: Shows "Dashboard" link and "Sign Out" button

## Environment Variables

Make sure you have `.env.local` set up:

```bash
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

## Password Provider Configuration

The app uses a custom password provider with role selection:

```typescript
// convex/passwordProvider.ts
export default Password<DataModel>({
  profile(params, ctx) {
    return {
      email: params.email as string,
      name: params.name as string | undefined,
      role: (params.role as "company" | "creator") || "creator",
    };
  },
});
```

## Schema

Users have the following fields:

```typescript
users: defineTable({
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),
  role: v.optional(v.union(v.literal("company"), v.literal("creator"))),
}).index("email", ["email"])
```

## Testing Authentication

1. Start your dev server: `pnpm run dev`
2. Make sure Convex is running: `pnpm convex dev`
3. Visit http://localhost:3000
4. Click "Get Started" to go to sign in
5. Create an account with email and password
6. You'll be redirected to the dashboard
7. Try signing out and signing back in

## Adding New Protected Routes

To add a new protected route:

1. Create a new file in `src/routes/` (e.g., `profile.tsx`)
2. Use the same pattern as `dashboard.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Authenticated, Unauthenticated } from "convex/react"

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {
  return (
    <>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
      <Authenticated>
        {/* Your protected content */}
      </Authenticated>
    </>
  )
}

function RedirectToSignIn() {
  if (typeof window !== 'undefined') {
    window.location.href = '/signin'
  }
  return null
}
```

3. Add a link in the Header navigation

## References

- [TanStack Router Documentation](https://tanstack.com/router/v1/docs/framework/react/routing/routing-concepts)
- [Convex Auth Documentation](https://labs.convex.dev/auth/config/passwords)
- [Convex Auth Authorization](https://labs.convex.dev/auth/authz)


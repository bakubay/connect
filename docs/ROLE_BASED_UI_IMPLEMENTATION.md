# Role-Based UI Implementation Summary

This document summarizes the role-based UI system that has been implemented in the Connect application.

## What Was Implemented

### 1. Core Utilities (`src/lib/useUserRole.ts`)

A custom React hook that provides easy access to user role information:

```tsx
const { role, isCompany, isCreator, isLoading, user } = useUserRole()
```

**Returns:**
- `role`: `"company" | "creator" | null`
- `isCompany`: boolean
- `isCreator`: boolean
- `isLoading`: boolean (while fetching user data)
- `user`: Full user object from Convex

### 2. Role Guard Components (`src/components/RoleGuard.tsx`)

Three reusable components for conditional rendering based on user role:

#### `<RoleGuard role="company|creator">`
Generic component that renders children only if user has the specified role:
```tsx
<RoleGuard role="company" fallback={<AccessDenied />}>
  <CompanyFeature />
</RoleGuard>
```

#### `<CompanyOnly>`
Wrapper that only renders content for company users:
```tsx
<CompanyOnly>
  <CreateCampaignButton />
</CompanyOnly>
```

#### `<CreatorOnly>`
Wrapper that only renders content for creator users:
```tsx
<CreatorOnly>
  <BrowseCampaignsButton />
</CreatorOnly>
```

### 3. Updated Components

#### Header Component (`src/components/Header.tsx`)
- Now uses the `useUserRole` hook for cleaner code
- Shows role-specific navigation links
- Added Dashboard link for authenticated users
- **Company users see:** My Campaigns
- **Creator users see:** Browse Campaigns, My Applications, My Profile

#### Dashboard Page (`src/routes/dashboard.tsx`)
Completely redesigned with role-specific dashboards:

**Company Dashboard shows:**
- Statistics: Total Campaigns, Active Campaigns, Draft Campaigns
- Quick actions to create new campaigns or view all campaigns
- Uses real-time data from Convex

**Creator Dashboard shows:**
- Statistics: Total Applications, Pending Review, Selected
- Quick actions to browse campaigns or view applications
- Uses real-time data from Convex

#### Home Page (`src/routes/index.tsx`)
- Updated to use `useUserRole` hook
- Redirects authenticated users based on their role:
  - **Companies** → `/campaigns`
  - **Creators** → `/browse` (after profile completion)

## How to Use

### Method 1: Using the Hook Directly

```tsx
import { useUserRole } from '../lib/useUserRole'

function MyComponent() {
  const { isCompany, isCreator, isLoading } = useUserRole()
  
  if (isLoading) return <Spinner />
  
  return (
    <div>
      {isCompany && <CompanyContent />}
      {isCreator && <CreatorContent />}
    </div>
  )
}
```

### Method 2: Using Wrapper Components

```tsx
import { CompanyOnly, CreatorOnly } from '../components/RoleGuard'

function MyPage() {
  return (
    <div>
      <CompanyOnly>
        <h1>Company Dashboard</h1>
      </CompanyOnly>
      
      <CreatorOnly>
        <h1>Creator Dashboard</h1>
      </CreatorOnly>
    </div>
  )
}
```

### Method 3: With Fallback Content

```tsx
<CompanyOnly fallback={<div>This feature is for companies only</div>}>
  <CreateCampaignForm />
</CompanyOnly>
```

## Files Modified

1. ✅ `src/lib/useUserRole.ts` - Created custom hook
2. ✅ `src/components/RoleGuard.tsx` - Created role guard components
3. ✅ `src/components/Header.tsx` - Updated to use new hook
4. ✅ `src/routes/dashboard.tsx` - Complete role-based redesign
5. ✅ `src/routes/index.tsx` - Updated to use new hook

## Documentation Created

1. ✅ `docs/role-based-ui-guide.md` - Comprehensive usage guide with examples
2. ✅ `docs/ROLE_BASED_UI_IMPLEMENTATION.md` - This implementation summary

## Testing Recommendations

### As a Company User:
1. Sign in as a company
2. Visit `/dashboard` - should see company-specific dashboard with campaign stats
3. Check navigation menu - should see "My Campaigns" link
4. Navigate to `/campaigns` - should see your campaigns

### As a Creator User:
1. Sign in as a creator
2. Visit `/dashboard` - should see creator-specific dashboard with application stats
3. Check navigation menu - should see "Browse Campaigns", "My Applications", "My Profile"
4. Navigate to `/browse` - should see available campaigns

### General Tests:
- No role content should flash during loading (loading states are handled)
- Switching between authenticated/unauthenticated should work smoothly
- Navigation menu updates immediately based on role
- Dashboard shows different UI for different roles

## Benefits

1. **Cleaner Code**: No more scattered role checks throughout components
2. **Reusable**: One hook/component system for all role-based UI
3. **Type-Safe**: TypeScript types ensure correct usage
4. **Loading States**: Built-in handling prevents content flashing
5. **Flexible**: Use hooks or components depending on your needs
6. **Maintainable**: Centralized role logic makes updates easy

## Next Steps

If you want to extend this system:

1. **Add new roles**: Update the schema and `UserRole` type in `useUserRole.ts`
2. **Add new role guards**: Create new wrapper components like `<AdminOnly>`
3. **Route protection**: Combine with TanStack Router's `beforeLoad` for server-side checks
4. **Permissions**: Extend the system with more granular permissions beyond just roles

## Example: Adding a New Role

1. Update schema to include new role:
```ts
role: v.optional(v.union(v.literal("company"), v.literal("creator"), v.literal("admin")))
```

2. Update type in `useUserRole.ts`:
```ts
export type UserRole = "company" | "creator" | "admin" | null
```

3. Create new guard component:
```tsx
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard role="admin" fallback={fallback}>{children}</RoleGuard>
}
```

4. Add admin navigation in Header:
```tsx
{isAdmin && <AdminLinks onClose={onClose} />}
```


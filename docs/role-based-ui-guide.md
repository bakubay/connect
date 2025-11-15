# Role-Based UI Guide

This guide shows you how to implement role-based UI in your components using the custom hooks and components provided.

## Available Roles

The application supports two user roles:
- `company` - Companies looking for creators
- `creator` - Creators looking for campaigns

## Using the `useUserRole` Hook

The `useUserRole` hook provides easy access to the current user's role information:

```tsx
import { useUserRole } from '../lib/useUserRole'

function MyComponent() {
  const { role, isCompany, isCreator, isLoading, user } = useUserRole()
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  return (
    <div>
      {isCompany && <CompanyContent />}
      {isCreator && <CreatorContent />}
    </div>
  )
}
```

### Return Values

- `role`: `"company" | "creator" | null` - The user's role
- `isCompany`: `boolean` - True if user is a company
- `isCreator`: `boolean` - True if user is a creator
- `isLoading`: `boolean` - True while user data is being fetched
- `user`: The full user object from Convex

## Using Role Guard Components

For cleaner JSX, use the `RoleGuard` components:

### CompanyOnly Component

Shows content only to company users:

```tsx
import { CompanyOnly } from '../components/RoleGuard'

function MyPage() {
  return (
    <div>
      <CompanyOnly>
        <h1>Welcome, Company User!</h1>
        <button>Create Campaign</button>
      </CompanyOnly>
    </div>
  )
}
```

### CreatorOnly Component

Shows content only to creator users:

```tsx
import { CreatorOnly } from '../components/RoleGuard'

function MyPage() {
  return (
    <div>
      <CreatorOnly>
        <h1>Welcome, Creator!</h1>
        <button>Browse Campaigns</button>
      </CreatorOnly>
    </div>
  )
}
```

### With Fallback Content

Both components accept a `fallback` prop for alternate content:

```tsx
import { CompanyOnly } from '../components/RoleGuard'

function MyPage() {
  return (
    <CompanyOnly fallback={<div>This content is for companies only</div>}>
      <CompanyDashboard />
    </CompanyOnly>
  )
}
```

## Generic RoleGuard Component

For more control, use the generic `RoleGuard` component:

```tsx
import { RoleGuard } from '../components/RoleGuard'

function MyComponent() {
  return (
    <>
      <RoleGuard role="company">
        <CompanySpecificFeature />
      </RoleGuard>
      
      <RoleGuard role="creator" fallback={<AccessDenied />}>
        <CreatorSpecificFeature />
      </RoleGuard>
    </>
  )
}
```

## Complete Example: Role-Based Dashboard

Here's a complete example showing multiple approaches:

```tsx
import { useUserRole } from '../lib/useUserRole'
import { CompanyOnly, CreatorOnly } from '../components/RoleGuard'
import { Link } from '@tanstack/react-router'

function Dashboard() {
  const { user, isLoading } = useUserRole()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      
      {/* Method 1: Using wrapper components */}
      <CompanyOnly>
        <div>
          <h2>Company Dashboard</h2>
          <Link to="/campaigns">My Campaigns</Link>
        </div>
      </CompanyOnly>
      
      <CreatorOnly>
        <div>
          <h2>Creator Dashboard</h2>
          <Link to="/browse">Browse Campaigns</Link>
        </div>
      </CreatorOnly>
      
      {/* Method 2: Using the hook directly */}
      <section>
        {useUserRole().isCompany ? (
          <CompanyStats />
        ) : (
          <CreatorStats />
        )}
      </section>
    </div>
  )
}
```

## Navigation Example

The Header component demonstrates role-based navigation:

```tsx
import { useUserRole } from '../lib/useUserRole'

function Navigation() {
  const { isCompany, isCreator } = useUserRole()
  
  return (
    <nav>
      {isCompany && (
        <>
          <Link to="/campaigns">My Campaigns</Link>
          <Link to="/campaigns/new">Create Campaign</Link>
        </>
      )}
      
      {isCreator && (
        <>
          <Link to="/browse">Browse Campaigns</Link>
          <Link to="/my-applications">My Applications</Link>
          <Link to="/profile/creator">My Profile</Link>
        </>
      )}
    </nav>
  )
}
```

## Best Practices

1. **Use wrapper components for cleaner JSX**: Prefer `<CompanyOnly>` over conditional rendering when possible

2. **Handle loading states**: Always check `isLoading` to avoid showing incorrect content during data fetching

3. **Provide fallbacks**: Use the `fallback` prop to show appropriate messages when access is restricted

4. **Combine with auth components**: Use alongside Convex's `<Authenticated>` and `<Unauthenticated>` components:

```tsx
import { Authenticated } from "convex/react"
import { CompanyOnly } from '../components/RoleGuard'

function ProtectedPage() {
  return (
    <Authenticated>
      <CompanyOnly fallback={<div>Companies only</div>}>
        <CompanyContent />
      </CompanyOnly>
    </Authenticated>
  )
}
```

5. **Route protection**: Combine role checks with TanStack Router's `beforeLoad`:

```tsx
export const Route = createFileRoute('/campaigns')({
  beforeLoad: async ({ context }) => {
    // Add custom role checking logic here if needed
  },
  component: CampaignsPage,
})
```

## Common Patterns

### Conditional Button Rendering

```tsx
function ActionButton() {
  const { isCompany, isCreator } = useUserRole()
  
  if (isCompany) {
    return <button>Create Campaign</button>
  }
  
  if (isCreator) {
    return <button>Apply to Campaign</button>
  }
  
  return null
}
```

### Different Layouts per Role

```tsx
function Layout() {
  return (
    <div>
      <Header />
      <CompanyOnly>
        <CompanyLayout />
      </CompanyOnly>
      <CreatorOnly>
        <CreatorLayout />
      </CreatorOnly>
      <Footer />
    </div>
  )
}
```

### Role-Specific Data Queries

```tsx
function MyData() {
  const { isCompany, isCreator } = useUserRole()
  
  const companyCampaigns = useQuery(
    api.campaigns.listMyCampaigns,
    isCompany ? {} : "skip"
  )
  
  const creatorApplications = useQuery(
    api.applications.listMyApplications,
    isCreator ? {} : "skip"
  )
  
  return (
    <>
      {isCompany && <CampaignsList campaigns={companyCampaigns} />}
      {isCreator && <ApplicationsList applications={creatorApplications} />}
    </>
  )
}
```

## Troubleshooting

### Content flashes before hiding

Make sure to check `isLoading`:

```tsx
const { isCompany, isLoading } = useUserRole()

if (isLoading) {
  return <LoadingSpinner />
}

// Now safe to render role-specific content
```

### Role not updating

The role comes from the user's database record. Make sure:
1. The user has a `role` field set in the database
2. You're using the latest user data (Convex handles reactivity automatically)

### Both roles showing

Check that you're using exclusive conditions:

```tsx
// Good
{isCompany && <CompanyContent />}
{isCreator && <CreatorContent />}

// Bad - could show both if role is somehow both
{role === "company" || role === "creator" ? <Content /> : null}
```


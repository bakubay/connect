import { ReactNode } from "react"
import { useUserRole } from "../lib/useUserRole"

interface RoleGuardProps {
  role: "company" | "creator"
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Component that conditionally renders children based on user role
 */
export function RoleGuard({ role, children, fallback = null }: RoleGuardProps) {
  const { role: userRole, isLoading } = useUserRole()
  
  if (isLoading) {
    return null
  }
  
  if (userRole !== role) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component that only renders for company users
 */
export function CompanyOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard role="company" fallback={fallback}>{children}</RoleGuard>
}

/**
 * Component that only renders for creator users
 */
export function CreatorOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard role="creator" fallback={fallback}>{children}</RoleGuard>
}


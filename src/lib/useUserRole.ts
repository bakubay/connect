import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"

export type UserRole = "company" | "creator" | null

export function useUserRole(): {
  role: UserRole
  isCompany: boolean
  isCreator: boolean
  isLoading: boolean
  user: any
} {
  const user = useQuery(api.users.getCurrentUser)
  
  const role = user?.role ?? null
  const isCompany = role === "company"
  const isCreator = role === "creator"
  const isLoading = user === undefined
  
  return {
    role,
    isCompany,
    isCreator,
    isLoading,
    user,
  }
}


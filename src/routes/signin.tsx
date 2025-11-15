import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '../components/SignIn'
import { Authenticated } from "convex/react"

export const Route = createFileRoute('/signin')({
  component: SignInRoute,
})

function SignInRoute() {
  return (
    <>
      <Authenticated>
        <RedirectToDashboard />
      </Authenticated>
      <SignIn />
    </>
  )
}

function RedirectToDashboard() {
  // Redirect authenticated users to dashboard
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard'
  }
  return null
}


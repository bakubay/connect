import { Link, useNavigate } from '@tanstack/react-router'
import { Authenticated, Unauthenticated } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useState } from 'react'
import { Home, Menu, LogOut, LogIn, Briefcase, Search, User, Sparkles } from 'lucide-react'
import { useUserRole } from '../lib/useUserRole'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Separator } from './ui/separator'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useAuthActions()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Navigation
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-6">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                activeProps={{
                  className: 'flex items-center gap-3 px-3 py-2 rounded-md bg-primary text-primary-foreground',
                }}
              >
                <Home className="h-4 w-4" />
                <span className="font-medium">Home</span>
              </Link>

              <Authenticated>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  activeProps={{
                    className: 'flex items-center gap-3 px-3 py-2 rounded-md bg-primary text-primary-foreground',
                  }}
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              </Authenticated>

              <Separator className="my-4" />

              <Unauthenticated>
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  activeProps={{
                    className: 'flex items-center gap-3 px-3 py-2 rounded-md bg-primary text-primary-foreground',
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  <span className="font-medium">Sign In</span>
                </Link>
              </Unauthenticated>

              <Authenticated>
                <AuthenticatedLinks onClose={() => setIsOpen(false)} onSignOut={signOut} navigate={navigate} />
              </Authenticated>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Connect
          </span>
        </Link>
      </div>
    </header>
  )
}

function AuthenticatedLinks({ onClose, onSignOut, navigate }: { onClose: () => void; onSignOut: () => void; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <UserRoleLinks onClose={onClose} onSignOut={onSignOut} navigate={navigate} />
  );
}

function UserRoleLinks({ onClose, onSignOut, navigate }: { onClose: () => void; onSignOut: () => void; navigate: ReturnType<typeof useNavigate> }) {
  const { isCompany, isCreator, isLoading } = useUserRole();
  
  if (isLoading) {
    return null;
  }
  
  return (
    <>
      {isCompany && <CompanyLinks onClose={onClose} />}
      {isCreator && <CreatorLinks onClose={onClose} />}
      
      <Separator className="my-4" />
      
      <Button
        onClick={async () => {
          await onSignOut()
          onClose()
          navigate({ to: '/' })
        }}
        variant="destructive"
        className="w-full justify-start gap-3"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </Button>
    </>
  );
}

function CompanyLinks({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Link
        to="/campaigns"
        onClick={onClose}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        activeProps={{
          className: 'flex items-center gap-3 px-3 py-2 rounded-md bg-primary text-primary-foreground',
        }}
      >
        <Briefcase className="h-4 w-4" />
        <span className="font-medium">My Campaigns</span>
      </Link>
    </>
  );
}

function CreatorLinks({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Link
        to="/browse"
        onClick={onClose}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        activeProps={{
          className: 'flex items-center gap-3 px-3 py-2 rounded-md bg-primary text-primary-foreground',
        }}
      >
        <Search className="h-4 w-4" />
        <span className="font-medium">Browse Campaigns</span>
      </Link>
      
      <Link
        to="/my-applications"
        onClick={onClose}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        activeProps={{
          className: 'flex items-center gap-3 px-3 py-2 rounded-md bg-primary text-primary-foreground',
        }}
      >
        <Briefcase className="h-4 w-4" />
        <span className="font-medium">My Applications</span>
      </Link>
      
      <Link
        to="/profile/creator"
        onClick={onClose}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        activeProps={{
          className: 'flex items-center gap-3 px-3 py-2 rounded-md bg-primary text-primary-foreground',
        }}
      >
        <User className="h-4 w-4" />
        <span className="font-medium">My Profile</span>
      </Link>
    </>
  );
}

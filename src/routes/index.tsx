import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Authenticated, Unauthenticated, useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { useEffect } from 'react'
import { Briefcase, Users, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { useUserRole } from '../lib/useUserRole'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
      <Authenticated>
        <DashboardRedirect />
      </Authenticated>
    </div>
  )
}

function LandingPage() {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-20 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Collaboration Platform</span>
        </div>
        
        <h1 className="text-6xl font-bold tracking-tight">
          Connect Brands with{' '}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Creators
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The platform that helps companies find perfect creator partnerships and enables creators to discover exciting collaboration opportunities.
        </p>
        
        <div className="pt-4">
          <Button asChild size="lg" className="text-lg h-14 px-8">
            <Link to="/signin" className="gap-2">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">For Companies</CardTitle>
            <CardDescription className="text-base">
              Find and collaborate with the perfect creators for your brand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Create targeted campaigns for creator partnerships</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Review ranked applicants based on fit</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">AI-powered negotiation assistance</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <Users className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-2xl">For Creators</CardTitle>
            <CardDescription className="text-base">
              Discover opportunities and grow your creative business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Browse active partnership campaigns</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Apply to opportunities that match your profile</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Automated partnership negotiations</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardRedirect() {
  const navigate = useNavigate();
  const { role, isLoading } = useUserRole();
  const profile = useQuery(api.creatorProfiles.getCurrentUserProfile);

  useEffect(() => {
    if (!isLoading && role) {
      if (role === "company") {
        navigate({ to: "/campaigns" });
      } else if (role === "creator") {
        if (profile !== undefined && (!profile || !profile.isComplete)) {
          navigate({ to: "/profile/creator" });
        } else if (profile?.isComplete) {
          navigate({ to: "/browse" });
        }
      }
    }
  }, [role, isLoading, profile, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="space-y-4">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

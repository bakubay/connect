import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CampaignBrowser } from "../components/CampaignBrowser";
import { useQuery, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@convex/_generated/api";
import { useEffect } from "react";
import { useUserRole } from "../lib/useUserRole";
import { CreatorOnly } from "../components/RoleGuard";
import { AlertCircle, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";

export const Route = createFileRoute("/browse")({
  component: BrowsePage,
});

function BrowsePage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <BrowsePageAuthenticated />
      </Authenticated>
    </>
  );
}

function BrowsePageAuthenticated() {
  const { isCompany, isLoading } = useUserRole();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }
  
  // Show message if company user tries to access
  if (isCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4">
        <div className="container max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Creator Feature</CardTitle>
                  <CardDescription>This page is for creators only</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  As a company user, you can create campaigns and review applicants instead.
                </AlertDescription>
              </Alert>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/campaigns" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  View My Campaigns
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <CreatorOnly>
      <BrowsePageContent />
    </CreatorOnly>
  );
}

function BrowsePageContent() {
  const profile = useQuery(api.creatorProfiles.getCurrentUserProfile);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile !== undefined && (!profile || !profile.isComplete)) {
      navigate({ to: "/profile/creator" });
    }
  }, [profile, navigate]);

  if (profile === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!profile || !profile.isComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <CampaignBrowser />
    </div>
  );
}

function RedirectToHome() {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
  return null
}


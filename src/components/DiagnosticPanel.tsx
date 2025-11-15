import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useUserRole } from "../lib/useUserRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export function DiagnosticPanel() {
  const { user, role, isLoading: roleLoading } = useUserRole();
  const profile = useQuery(api.creatorProfiles.getCurrentUserProfile);
  const campaigns = useQuery(api.campaigns.listActive);

  if (roleLoading || user === undefined) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading Diagnostics...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const checks = [
    {
      name: "User Authentication",
      status: !!user,
      message: user ? `Logged in as: ${user.email || user.name || "Anonymous"}` : "Not logged in",
      critical: true,
    },
    {
      name: "User Role",
      status: !!role,
      message: role ? `Role: ${role}` : "No role assigned",
      critical: true,
    },
    {
      name: "Is Creator",
      status: role === "creator",
      message: role === "creator" ? "User is a creator" : `User is a ${role || "not assigned role"}`,
      critical: role !== "creator",
    },
    {
      name: "Creator Profile Exists",
      status: !!profile,
      message: profile ? `Profile found (ID: ${profile._id})` : "No creator profile found",
      critical: role === "creator",
    },
    {
      name: "Profile Complete",
      status: profile?.isComplete ?? false,
      message: profile?.isComplete ? "Profile is complete" : "Profile incomplete or missing",
      critical: role === "creator",
    },
    {
      name: "Active Campaigns Available",
      status: (campaigns?.length ?? 0) > 0,
      message: `${campaigns?.length ?? 0} active campaign(s) available`,
      critical: false,
    },
  ];

  const criticalIssues = checks.filter(check => check.critical && !check.status);
  const allGood = checks.filter(check => check.critical).every(check => check.status);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <Card className={allGood ? "border-green-500" : "border-red-500"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {allGood ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            Application System Diagnostics
          </CardTitle>
          <CardDescription>
            {allGood
              ? "All systems ready for applying to campaigns!"
              : `${criticalIssues.length} critical issue(s) preventing applications`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {checks.map((check, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className="mt-0.5">
                {check.status ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : check.critical ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{check.name}</span>
                  {check.critical && (
                    <Badge variant={check.status ? "default" : "destructive"} className="text-xs">
                      {check.status ? "OK" : "REQUIRED"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{check.message}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Detailed Profile Info */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Creator Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {profile.name}
              </div>
              <div>
                <span className="font-medium">Complete:</span>{" "}
                <Badge variant={profile.isComplete ? "default" : "destructive"}>
                  {profile.isComplete ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Bio:</span> {profile.bio}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Social Links:</span>{" "}
                {profile.socialMediaLinks?.length || 0} link(s)
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      {!allGood && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {!user && (
                <li className="flex items-center gap-2">
                  <span className="text-red-500">•</span>
                  Please sign in to your account
                </li>
              )}
              {user && !role && (
                <li className="flex items-center gap-2">
                  <span className="text-red-500">•</span>
                  Set your account role (company or creator)
                </li>
              )}
              {user && role && role !== "creator" && (
                <li className="flex items-center gap-2">
                  <span className="text-red-500">•</span>
                  You need a creator account to apply to campaigns
                </li>
              )}
              {role === "creator" && !profile && (
                <li className="flex items-center gap-2">
                  <span className="text-red-500">•</span>
                  Create your creator profile at /profile/creator
                </li>
              )}
              {role === "creator" && profile && !profile.isComplete && (
                <li className="flex items-center gap-2">
                  <span className="text-red-500">•</span>
                  Complete your creator profile at /profile/creator
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


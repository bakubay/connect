import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Link } from "@tanstack/react-router";
import { Plus, Edit, Eye, PlayCircle, XCircle } from "lucide-react";
import type { Id } from "@convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

export function CampaignList() {
  const campaigns = useQuery(api.campaigns.list);
  const updateStatus = useMutation(api.campaigns.updateStatus);

  const handleStatusChange = async (
    id: Id<"campaigns">,
    status: "draft" | "active" | "closed"
  ) => {
    try {
      await updateStatus({ id, status });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (campaigns === undefined) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-11 w-40" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: "draft" | "active" | "closed") => {
    const variants = {
      draft: "secondary" as const,
      active: "default" as const,
      closed: "destructive" as const,
    };

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">My Campaigns</h1>
          <p className="text-muted-foreground">Manage your creator partnership campaigns</p>
        </div>
        <Button asChild>
          <Link to="/campaigns/new" className="gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">No Campaigns Yet</CardTitle>
            <CardDescription className="text-base">
              Create your first campaign to start finding creators
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild size="lg">
              <Link to="/campaigns/new" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Campaign
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl">{campaign.title}</CardTitle>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <CardDescription className="line-clamp-2 text-base">
                      {campaign.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-6 text-sm mb-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Budget</p>
                    <p className="text-xl font-bold">
                      ${campaign.budget.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Deadline</p>
                    <p className="font-semibold">
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 border-t pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to="/campaigns/$campaignId"
                    params={{ campaignId: campaign._id }}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to="/campaigns/$campaignId"
                    params={{ campaignId: campaign._id }}
                    search={{ edit: true }}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>

                {campaign.status === "draft" && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(campaign._id, "active")}
                    className="gap-2"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Publish
                  </Button>
                )}

                {campaign.status === "active" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusChange(campaign._id, "closed")}
                    className="gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Close
                  </Button>
                )}

                {campaign.status === "closed" && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(campaign._id, "active")}
                    className="gap-2"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Reopen
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


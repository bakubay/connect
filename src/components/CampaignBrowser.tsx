import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Calendar, DollarSign, FileText, Eye, Video } from "lucide-react";

export function CampaignBrowser() {
  const campaigns = useQuery(api.campaigns.listActive);

  if (campaigns === undefined) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Browse Campaigns
        </h1>
        <p className="text-lg text-muted-foreground">
          Find partnership opportunities that match your profile
        </p>
      </div>

      {campaigns.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">No Active Campaigns</CardTitle>
            <CardDescription className="text-base">
              Check back later for new partnership opportunities
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card
              key={campaign._id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">
                      ${campaign.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Requirements
                    </p>
                  </div>
                  <p className="text-sm line-clamp-3">
                    {campaign.criteria}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link
                    to="/campaigns/$campaignId"
                    params={{ campaignId: campaign._id }}
                    className="gap-2"
                    onClick={() => console.log("📄 Navigating to campaign details:", campaign._id)}
                  >
                    <Eye className="h-4 w-4" />
                    Details
                  </Link>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link
                    to="/campaigns/$campaignId/apply"
                    params={{ campaignId: campaign._id }}
                    className="gap-2"
                    onClick={() => console.log("📝 Navigating to apply page:", campaign._id)}
                  >
                    <Video className="h-4 w-4" />
                    Apply
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


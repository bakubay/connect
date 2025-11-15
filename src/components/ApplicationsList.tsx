import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Clock, CheckCircle, XCircle, Eye, Video, File, FileVideo, FileText, Image as ImageIcon, Download, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

export function ApplicationsList() {
  const applications = useQuery(api.applications.getByCreator);

  if (applications === undefined) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, icon: <Clock className="h-3 w-3" /> },
      reviewing: { variant: "default" as const, icon: <Eye className="h-3 w-3" /> },
      selected: { variant: "default" as const, icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { variant: "destructive" as const, icon: <XCircle className="h-3 w-3" /> },
    };

    const config = variants[status as keyof typeof variants] || variants.pending;

    return (
      <Badge variant={config.variant} className="gap-1.5">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          My Applications
        </h1>
        <p className="text-lg text-muted-foreground">
          Track the status of your campaign applications
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">No Applications Yet</CardTitle>
            <CardDescription className="text-base">
              Browse campaigns and apply to opportunities that match your profile
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild size="lg">
              <Link to="/browse" className="gap-2">
                Browse Campaigns
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-2xl">
                        {app.campaign?.title || "Unknown Campaign"}
                      </CardTitle>
                      {getStatusBadge(app.status)}
                    </div>
                    <CardDescription>
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">

                {app.campaign && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Campaign Budget:</span>
                    <span className="text-lg font-bold">
                      ${app.campaign.budget.toLocaleString()}
                    </span>
                  </div>
                )}

                {app.videoUrl && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Video Submission</p>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={app.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <Video className="h-4 w-4" />
                        Watch Video
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                )}

                {app.uploadedFiles && app.uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Uploaded Files ({app.uploadedFiles.length})
                    </p>
                    <div className="space-y-2">
                      {app.uploadedFiles.map((file, idx) => (
                        <FileDisplayItem key={idx} file={file} />
                      ))}
                    </div>
                  </div>
                )}

                {app.fitScore !== undefined && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">AI Fit Score</CardTitle>
                        <span className="text-3xl font-bold text-primary">
                          {app.fitScore}/100
                        </span>
                      </div>
                    </CardHeader>
                    {app.fitReasoning && (
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">
                          {app.fitReasoning}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                )}
              </CardContent>

              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to="/campaigns/$campaignId"
                    params={{ campaignId: app.campaignId }}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Campaign
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

// Component to display individual uploaded files
function FileDisplayItem({ file }: { file: { storageId: Id<"_storage">; filename: string; fileType: string; fileSize: number } }) {
  const fileUrl = useQuery(api.applications.getFileUrl, { storageId: file.storageId });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("video/")) return <FileVideo size={18} className="text-purple-600" />;
    if (fileType.startsWith("image/")) return <ImageIcon size={18} className="text-blue-600" />;
    if (fileType.includes("pdf")) return <FileText size={18} className="text-red-600" />;
    return <File size={18} className="text-gray-600" />;
  };

  return (
    <div className="flex items-center justify-between bg-muted p-2.5 rounded-lg border">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {getFileIcon(file.fileType)}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">
            {file.filename}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.fileSize)}
          </p>
        </div>
      </div>
      {fileUrl && (
        <Button variant="ghost" size="sm" asChild>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-1 h-7"
          >
            <Download className="h-3 w-3" />
            View
          </a>
        </Button>
      )}
    </div>
  );
}


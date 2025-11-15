import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";
import type { Id } from "@convex/_generated/dataModel";
import { CampaignDocumentPaste } from "./CampaignDocumentPaste";
import { FileText, Edit3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";

interface CampaignFormProps {
  campaign?: {
    _id: Id<"campaigns">;
    title: string;
    description: string;
    criteria: string;
    budget: number;
    deadline: string;
    status: "draft" | "active" | "closed";
  };
  onSuccess?: () => void;
}

export function CampaignForm({ campaign, onSuccess }: CampaignFormProps) {
  const createCampaign = useMutation(api.campaigns.create);
  const updateCampaign = useMutation(api.campaigns.update);

  const [mode, setMode] = useState<"manual" | "paste">(campaign ? "manual" : "paste");
  const [title, setTitle] = useState(campaign?.title || "");
  const [description, setDescription] = useState(campaign?.description || "");
  const [criteria, setCriteria] = useState(campaign?.criteria || "");
  const [budget, setBudget] = useState(campaign?.budget?.toString() || "");
  const [deadline, setDeadline] = useState(campaign?.deadline || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extracted, setExtracted] = useState(false);

  const handleExtracted = (data: any) => {
    setTitle(data.title);
    setDescription(data.description);
    setCriteria(data.criteria);
    setBudget(data.budget.toString());
    setDeadline(data.deadline);
    setExtracted(true);
    setMode("manual");
  };

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "active") => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (campaign) {
        await updateCampaign({
          id: campaign._id,
          title,
          description,
          criteria,
          budget: parseFloat(budget),
          deadline,
        });
      } else {
        await createCampaign({
          title,
          description,
          criteria,
          budget: parseFloat(budget),
          deadline,
          status,
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid =
    title.trim() &&
    description.trim() &&
    criteria.trim() &&
    budget &&
    parseFloat(budget) > 0 &&
    deadline;

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">
            {campaign ? "Edit Campaign" : "Create New Campaign"}
          </CardTitle>
          <CardDescription>
            {campaign 
              ? "Update your campaign details below" 
              : "Fill in the details or paste your campaign brief to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!campaign && (
            <>
              <div className="flex gap-2 mb-6">
                <Button
                  type="button"
                  variant={mode === "paste" ? "default" : "outline"}
                  onClick={() => setMode("paste")}
                  className="flex-1 gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Paste Campaign Brief
                </Button>
                <Button
                  type="button"
                  variant={mode === "manual" ? "default" : "outline"}
                  onClick={() => setMode("manual")}
                  className="flex-1 gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Fill Form Manually
                </Button>
              </div>
              <Separator className="mb-6" />
            </>
          )}

          {extracted && mode === "manual" && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800 font-medium">
                ✓ Campaign details extracted! Review and edit below, then publish.
              </AlertDescription>
            </Alert>
          )}

        {mode === "paste" && !campaign && (
          <CampaignDocumentPaste onExtracted={handleExtracted} />
        )}

          {mode === "manual" && (
            <form onSubmit={(e) => handleSubmit(e, "active")} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., TikTok Product Review Campaign"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you're looking for in this campaign..."
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="criteria">Creator Requirements *</Label>
                <Textarea
                  id="criteria"
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  placeholder="e.g., Minimum 10K followers, tech niche, engagement rate >3%..."
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="1000"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                {!campaign && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={(e) => handleSubmit(e as any, "draft")}
                    disabled={isSubmitting || !isValid}
                    className="flex-1"
                  >
                    Save as Draft
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="flex-1"
                >
                  {isSubmitting
                    ? "Saving..."
                    : campaign
                      ? "Update Campaign"
                      : "Publish Campaign"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


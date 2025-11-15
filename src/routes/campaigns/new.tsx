import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CampaignForm } from "../../components/CampaignForm";
import { Authenticated, Unauthenticated } from "convex/react";

export const Route = createFileRoute("/campaigns/new")({
  component: NewCampaignPage,
});

function NewCampaignPage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <NewCampaignPageContent />
      </Authenticated>
    </>
  );
}

function NewCampaignPageContent() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: "/campaigns" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <CampaignForm onSuccess={handleSuccess} />
    </div>
  );
}

function RedirectToHome() {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
  return null
}


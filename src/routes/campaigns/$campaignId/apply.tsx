import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@convex/_generated/api";
import { ApplicationForm } from "../../../components/ApplicationForm";
import type { Id } from "@convex/_generated/dataModel";

export const Route = createFileRoute("/campaigns/$campaignId/apply")({
  component: ApplyPage,
});

function ApplyPage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <ApplyPageContent />
      </Authenticated>
    </>
  );
}

function ApplyPageContent() {
  const { campaignId } = Route.useParams();
  const navigate = useNavigate();
  const campaign = useQuery(api.campaigns.get, {
    id: campaignId as Id<"campaigns">,
  });

  console.log("🎯 Apply page loaded:", { campaignId, campaignLoaded: campaign !== undefined });

  const handleSuccess = () => {
    console.log("✅ Application success! Navigating to my-applications");
    navigate({ to: "/my-applications" });
  };

  if (campaign === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Campaign not found
          </h2>
          <p className="text-gray-600 mb-6">
            The campaign you're trying to apply to doesn't exist
          </p>
          <button
            onClick={() => navigate({ to: "/browse" })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Browse Campaigns
          </button>
        </div>
      </div>
    );
  }

  if (campaign.status !== "active") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Campaign not accepting applications
          </h2>
          <p className="text-gray-600 mb-6">
            This campaign is currently {campaign.status}
          </p>
          <button
            onClick={() => navigate({ to: "/browse" })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Browse Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <ApplicationForm
        campaignId={campaignId as Id<"campaigns">}
        campaign={campaign}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

function RedirectToHome() {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
  return null
}

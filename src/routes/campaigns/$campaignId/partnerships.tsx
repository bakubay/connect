import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@convex/_generated/api";
import { PartnershipsList } from "../../../components/PartnershipsList";
import type { Id } from "@convex/_generated/dataModel";

export const Route = createFileRoute("/campaigns/$campaignId/partnerships")({
  component: PartnershipsPage,
});

function PartnershipsPage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <PartnershipsPageContent />
      </Authenticated>
    </>
  );
}

function PartnershipsPageContent() {
  const { campaignId } = Route.useParams();
  const navigate = useNavigate();
  const campaign = useQuery(api.campaigns.get, {
    id: campaignId as Id<"campaigns">,
  });

  if (campaign === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Campaign not found
          </h2>
          <p className="text-gray-600 mb-6">
            The campaign you're looking for doesn't exist
          </p>
          <button
            onClick={() => navigate({ to: "/campaigns" })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <button
            onClick={() =>
              navigate({
                to: "/campaigns/$campaignId",
                params: { campaignId },
              })
            }
            className="text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            ← Back to Campaign
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Partnerships for {campaign.title}
          </h1>
          <p className="text-gray-600">
            Manage and negotiate with selected creators
          </p>
        </div>

        <PartnershipsList campaignId={campaignId as Id<"campaigns">} />
      </div>
    </div>
  );
}

function RedirectToHome() {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
  return null
}


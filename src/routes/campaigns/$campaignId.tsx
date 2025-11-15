import { createFileRoute, Link, useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import { useQuery, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@convex/_generated/api";
import { CampaignForm } from "../../components/CampaignForm";
import type { Id } from "@convex/_generated/dataModel";

export const Route = createFileRoute("/campaigns/$campaignId")({
  component: CampaignDetailPage,
});

function CampaignDetailPage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <CampaignDetailPageContent />
      </Authenticated>
    </>
  );
}

function CampaignDetailPageContent() {
  const { campaignId } = Route.useParams();
  const { edit } = Route.useSearch() as { edit?: boolean };
  const navigate = useNavigate();
  const location = useLocation();
  const campaign = useQuery(api.campaigns.get, {
    id: campaignId as Id<"campaigns">,
  });
  const user = useQuery(api.users.getCurrentUser);
  const partnershipsCount = useQuery(api.partnerships.getCountByCampaign, {
    campaignId: campaignId as Id<"campaigns">,
  });
  
  // Check if we're on a child route by checking the pathname
  const isChildRoute = location.pathname.includes('/apply') || location.pathname.includes('/applicants') || location.pathname.includes('/partnerships');

  const handleSuccess = () => {
    navigate({ to: "/campaigns/$campaignId", params: { campaignId } });
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

  if (edit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <CampaignForm campaign={campaign} onSuccess={handleSuccess} />
      </div>
    );
  }

  const getStatusBadge = (status: "draft" | "active" | "closed") => {
    const styles = {
      draft: "bg-gray-100 text-gray-700 border-gray-300",
      active: "bg-green-100 text-green-700 border-green-300",
      closed: "bg-red-100 text-red-700 border-red-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const isOwner = user?._id === campaign.companyId;

  // If rendering a child route (apply or applicants), render the Outlet
  if (isChildRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {campaign.title}
              </h1>
              {getStatusBadge(campaign.status)}
            </div>
            <button
              onClick={() => navigate({ to: isOwner ? "/campaigns" : "/browse" })}
              className="text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-gray-800 whitespace-pre-wrap">
                {campaign.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Creator Requirements
              </h3>
              <p className="text-gray-800 whitespace-pre-wrap">
                {campaign.criteria}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Budget
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  ${campaign.budget.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {new Date(campaign.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {isOwner && campaign.status === "active" && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <Link
                to="/campaigns/$campaignId/applicants"
                params={{ campaignId: campaign._id }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                View Applicants
              </Link>
              <Link
                to="/campaigns/$campaignId/partnerships"
                params={{ campaignId: campaign._id }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                View Partnerships
                {partnershipsCount !== undefined && partnershipsCount > 0 && (
                  <span className="bg-green-800 text-white text-sm font-bold px-2 py-0.5 rounded-full">
                    {partnershipsCount}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>
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

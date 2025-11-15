import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { MessageCircle, User, TrendingUp, Handshake } from "lucide-react";

interface PartnershipsListProps {
  campaignId: Id<"campaigns">;
}

export function PartnershipsList({ campaignId }: PartnershipsListProps) {
  const partnerships = useQuery(api.partnerships.getByCampaign, {
    campaignId,
  });

  if (partnerships === undefined) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-blue-100 text-blue-700 border-blue-300",
      negotiating: "bg-yellow-100 text-yellow-700 border-yellow-300",
      approved: "bg-green-100 text-green-700 border-green-300",
      active: "bg-purple-100 text-purple-700 border-purple-300",
      completed: "bg-gray-100 text-gray-700 border-gray-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${
          styles[status as keyof typeof styles] || styles.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (partnerships.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <Handshake size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No partnerships yet
        </h3>
        <p className="text-gray-600">
          Select creators from your applicants to start partnerships
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Partnership Summary
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {partnerships.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {partnerships.filter((p) => p.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {partnerships.filter((p) => p.status === "negotiating").length}
            </div>
            <div className="text-sm text-gray-600">Negotiating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {partnerships.filter((p) => p.status === "approved").length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {partnerships.map((partnership, index) => (
          <div
            key={partnership._id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {partnership.application?.fitScore !== undefined && (
                  <div className="flex items-center gap-2 bg-indigo-100 rounded-full px-4 py-2">
                    <TrendingUp size={20} className="text-indigo-600" />
                    <span className="text-2xl font-bold text-indigo-600">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-indigo-700 ml-2">
                      {partnership.application.fitScore}/100
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {partnership.profile?.name || "Unknown Creator"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Partnership created{" "}
                    {new Date(partnership.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Applied{" "}
                    {partnership.application
                      ? new Date(partnership.application.appliedAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
              {getStatusBadge(partnership.status)}
            </div>

            {partnership.application?.fitScore !== undefined &&
              partnership.application?.fitReasoning && (
                <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-indigo-900 mb-1">
                    AI Match Analysis
                  </p>
                  <p className="text-sm text-indigo-700">
                    {partnership.application.fitReasoning}
                  </p>
                </div>
              )}

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  About the Creator:
                </p>
                <p className="text-sm text-gray-600">
                  {partnership.profile?.bio}
                </p>
              </div>

              {partnership.profile?.socialMediaLinks &&
                partnership.profile.socialMediaLinks.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Social Media:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {partnership.profile.socialMediaLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  alert(
                    "Negotiation feature coming soon! You'll be able to discuss terms and finalize the partnership here."
                  );
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                <MessageCircle size={16} />
                Start Negotiation
              </button>
              {partnership.creator?.email && (
                <a
                  href={`mailto:${partnership.creator.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Contact Directly
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


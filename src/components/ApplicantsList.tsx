import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { CheckCircle, XCircle, Eye, User, TrendingUp, Video, ExternalLink, File, FileVideo, FileText, Image as ImageIcon, Download } from "lucide-react";

interface ApplicantsListProps {
  campaignId: Id<"campaigns">;
}

export function ApplicantsList({ campaignId }: ApplicantsListProps) {
  const applications = useQuery(api.applications.getRankedByCampaign, {
    campaignId,
  });
  const updateStatus = useMutation(api.applications.updateStatus);

  if (applications === undefined) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleUpdateStatus = async (
    applicationId: Id<"applications">,
    status: "pending" | "reviewing" | "selected" | "rejected"
  ) => {
    try {
      await updateStatus({ applicationId, status });
    } catch (error: any) {
      alert(error.message || "Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      reviewing: "bg-blue-100 text-blue-700 border-blue-300",
      selected: "bg-green-100 text-green-700 border-green-300",
      rejected: "bg-red-100 text-red-700 border-red-300",
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

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <User size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No applicants yet
        </h3>
        <p className="text-gray-600">
          Creators will see your campaign and can apply if interested
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Applicants Summary
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {applications.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {applications.filter((a) => a.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {applications.filter((a) => a.status === "selected").length}
            </div>
            <div className="text-sm text-gray-600">Selected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {applications.filter((a) => a.status === "rejected").length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {applications.map((app, index) => (
          <div
            key={app._id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {app.fitScore !== undefined && (
                  <div className="flex items-center gap-2 bg-indigo-100 rounded-full px-4 py-2">
                    <TrendingUp size={20} className="text-indigo-600" />
                    <span className="text-2xl font-bold text-indigo-600">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-indigo-700 ml-2">
                      {app.fitScore}/100
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {app.profile?.name || "Unknown Creator"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {getStatusBadge(app.status)}
            </div>

            {app.fitScore !== undefined && app.fitReasoning && (
              <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-indigo-900 mb-1">
                  AI Analysis
                </p>
                <p className="text-sm text-indigo-700">{app.fitReasoning}</p>
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Bio:</p>
                <p className="text-sm text-gray-600">{app.profile?.bio}</p>
              </div>

              {app.profile?.socialMediaLinks &&
                app.profile.socialMediaLinks.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Social Media:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {app.profile.socialMediaLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                        >
                          {link.platform}
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {app.videoUrl && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Video URL:
                  </p>
                  <a
                    href={app.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded-lg transition-colors"
                  >
                    <Video size={18} />
                    Watch Video
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {app.uploadedFiles && app.uploadedFiles.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Files ({app.uploadedFiles.length}):
                  </p>
                  <div className="space-y-2">
                    {app.uploadedFiles.map((file, idx) => (
                      <FileDisplayItem key={idx} file={file} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {app.status !== "reviewing" && (
                <button
                  onClick={() => handleUpdateStatus(app._id, "reviewing")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors"
                >
                  <Eye size={16} />
                  Review
                </button>
              )}
              {app.status !== "selected" && (
                <button
                  onClick={() => handleUpdateStatus(app._id, "selected")}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium rounded-lg transition-colors"
                >
                  <CheckCircle size={16} />
                  Select
                </button>
              )}
              {app.status !== "rejected" && (
                <button
                  onClick={() => handleUpdateStatus(app._id, "rejected")}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component to display individual uploaded files with download links
function FileDisplayItem({ file }: { file: { storageId: Id<"_storage">; filename: string; fileType: string; fileSize: number } }) {
  const fileUrl = useQuery(api.applications.getFileUrl, { storageId: file.storageId });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("video/")) return <FileVideo size={20} className="text-purple-600" />;
    if (fileType.startsWith("image/")) return <ImageIcon size={20} className="text-blue-600" />;
    if (fileType.includes("pdf")) return <FileText size={20} className="text-red-600" />;
    return <File size={20} className="text-gray-600" />;
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getFileIcon(file.fileType)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {file.filename}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(file.fileSize)}
          </p>
        </div>
      </div>
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 flex items-center gap-1 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium rounded transition-colors"
          download={file.filename}
        >
          <Download size={14} />
          View
        </a>
      )}
    </div>
  );
}


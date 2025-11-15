import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState, useRef } from "react";
import type { Id } from "@convex/_generated/dataModel";
import { Video, ExternalLink, Upload, File, X, FileVideo, FileText, Image as ImageIcon } from "lucide-react";

interface ApplicationFormProps {
  campaignId: Id<"campaigns">;
  campaign: {
    title: string;
    budget: number;
  };
  onSuccess?: () => void;
}

interface UploadedFile {
  storageId: Id<"_storage">;
  filename: string;
  fileType: string;
  fileSize: number;
  file?: File;
}

export function ApplicationForm({
  campaignId,
  campaign,
  onSuccess,
}: ApplicationFormProps) {
  const submitApplication = useMutation(api.applications.submit);
  const generateUploadUrl = useMutation(api.applications.generateUploadUrl);
  const hasApplied = useQuery(api.applications.hasApplied, { campaignId });
  const existingApplication = useQuery(api.applications.getApplication, {
    campaignId,
  });

  const [videoUrl, setVideoUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (hasApplied && existingApplication) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Application Submitted
          </h2>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              You have already applied to this campaign
            </p>
            <p className="text-green-600 text-sm mt-2">
              Status: {existingApplication.status}
            </p>
          </div>
          <div className="space-y-4">
            {existingApplication.videoUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </h3>
                <a
                  href={existingApplication.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <Video size={18} />
                  View Video
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
            {existingApplication.uploadedFiles && existingApplication.uploadedFiles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Files ({existingApplication.uploadedFiles.length})
                </h3>
                <div className="space-y-2">
                  {existingApplication.uploadedFiles.map((file, idx) => (
                    <FileDisplay key={idx} file={file} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Validate file size (20MB limit for Convex)
        if (file.size > 20 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum file size is 20MB.`);
          continue;
        }

        // Step 1: Generate upload URL
        const postUrl = await generateUploadUrl();

        // Step 2: Upload the file
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        const { storageId } = await result.json();

        // Step 3: Add to uploaded files list
        setUploadedFiles(prev => [
          ...prev,
          {
            storageId,
            filename: file.name,
            fileType: file.type,
            fileSize: file.size,
            file,
          },
        ]);
      }
    } catch (error: any) {
      alert(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("🚀 Submitting application...", {
      campaignId,
      hasVideoUrl: !!videoUrl.trim(),
      uploadedFilesCount: uploadedFiles.length,
    });

    try {
      const result = await submitApplication({
        campaignId,
        videoUrl: videoUrl.trim() || undefined,
        uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles.map(f => ({
          storageId: f.storageId,
          filename: f.filename,
          fileType: f.fileType,
          fileSize: f.fileSize,
        })) : undefined,
      });

      console.log("✅ Application submitted successfully!", result);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("❌ Application submission failed:", error);
      alert(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const hasValidVideoUrl = videoUrl.trim() && isValidUrl(videoUrl);
  const isValid = hasValidVideoUrl || uploadedFiles.length > 0;

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
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Video size={32} className="text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Submit Video to {campaign.title}
          </h2>
          <p className="text-gray-600">
            Campaign Budget: ${campaign.budget.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video URL Section */}
          <div>
            <label
              htmlFor="videoUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Video URL (Optional)
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Link to your TikTok, YouTube, Instagram Reel, or other video
            </p>
            <input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@user/video/..."
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
            />
            {videoUrl && !isValidUrl(videoUrl) && (
              <p className="text-sm text-red-600 mt-1">
                Please enter a valid URL
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Files (Optional)
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Upload videos, images, PDFs, or media kits (max 20MB per file)
            </p>
            
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                multiple
                accept="video/*,image/*,.pdf"
                className="hidden"
                disabled={isUploading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={18} />
                {isUploading ? "Uploading..." : "Choose Files"}
              </button>
              {uploadedFiles.length > 0 && (
                <span className="text-sm text-gray-600">
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
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
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X size={18} className="text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Accepted formats:</strong>
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Videos: MP4, MOV, AVI, etc.</li>
                <li>• Images: JPG, PNG, GIF, etc.</li>
                <li>• Documents: PDF</li>
                <li>• Max size: 20MB per file</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Provide at least one submission (video URL or uploaded files).
              Companies will review your profile and materials to evaluate fit.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid || isUploading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : isUploading ? (
              "Wait for upload to finish..."
            ) : (
              <>
                <Video size={20} />
                Submit Application
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// FileDisplay component for showing uploaded files with download links
function FileDisplay({ file }: { file: { storageId: Id<"_storage">; filename: string; fileType: string; fileSize: number } }) {
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
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
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
          className="ml-2 p-2 hover:bg-indigo-50 rounded transition-colors text-indigo-600"
          download={file.filename}
        >
          <ExternalLink size={16} />
        </a>
      )}
    </div>
  );
}


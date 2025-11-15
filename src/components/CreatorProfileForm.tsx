import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface SocialMediaLink {
  platform: string;
  url: string;
}

export function CreatorProfileForm({ onComplete }: { onComplete?: () => void }) {
  const profile = useQuery(api.creatorProfiles.getCurrentUserProfile);
  const createOrUpdate = useMutation(api.creatorProfiles.createOrUpdate);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>([
    { platform: "", url: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio);
      setSocialMediaLinks(
        profile.socialMediaLinks.length > 0
          ? profile.socialMediaLinks
          : [{ platform: "", url: "" }]
      );
    }
  }, [profile]);

  const addSocialMediaLink = () => {
    setSocialMediaLinks([...socialMediaLinks, { platform: "", url: "" }]);
  };

  const removeSocialMediaLink = (index: number) => {
    if (socialMediaLinks.length > 1) {
      setSocialMediaLinks(socialMediaLinks.filter((_, i) => i !== index));
    }
  };

  const updateSocialMediaLink = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    const updated = [...socialMediaLinks];
    updated[index][field] = value;
    setSocialMediaLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent, markComplete: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validLinks = socialMediaLinks.filter(
        (link) => link.platform && link.url
      );

      await createOrUpdate({
        name,
        bio,
        socialMediaLinks: validLinks,
        isComplete: markComplete,
      });

      if (markComplete && onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = name.trim() && bio.trim() && socialMediaLinks.some(link => link.platform && link.url);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {profile ? "Edit Your Profile" : "Complete Your Creator Profile"}
        </h2>
        <p className="text-gray-600 mb-8">
          Complete your profile to start applying for campaigns
        </p>

        <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio *
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself, your content style, and your audience..."
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Social Media Links *
              </label>
              <button
                type="button"
                onClick={addSocialMediaLink}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
              >
                <Plus size={16} />
                Add Link
              </button>
            </div>

            <div className="space-y-3">
              {socialMediaLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) =>
                      updateSocialMediaLink(index, "platform", e.target.value)
                    }
                    placeholder="Platform (e.g., TikTok)"
                    className="w-1/3 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      updateSocialMediaLink(index, "url", e.target.value)
                    }
                    placeholder="Profile URL"
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  {socialMediaLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSocialMediaLink(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e as any, false)}
              disabled={isSubmitting || !isValid}
              className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Saving..." : "Complete Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


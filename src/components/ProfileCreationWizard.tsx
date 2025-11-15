import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@convex/_generated/api";
import { BioSelector } from "./BioSelector";

interface ProfileSuggestions {
  bioOptions: Array<{
    style: "professional" | "casual" | "impact_focused";
    text: string;
  }>;
  suggestedCategories: string[];
  audienceDescription: string;
  uniqueValueProp: string;
}

interface ProfileCreationWizardProps {
  onComplete: (data: {
    name: string;
    bio: string;
    socialMediaLinks: Array<{ platform: string; url: string }>;
  }) => void;
}

export function ProfileCreationWizard({
  onComplete,
}: ProfileCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [contentDescription, setContentDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [uniqueValue, setUniqueValue] = useState("");
  const [suggestions, setSuggestions] = useState<ProfileSuggestions | null>(
    null
  );
  const [selectedBio, setSelectedBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<
    Array<{ platform: string; url: string }>
  >([{ platform: "", url: "" }]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSuggestions = useAction(
    api.creatorProfiles.generateProfileSuggestions
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateSuggestions({
        contentDescription,
        audience,
        uniqueValue,
        name: name || undefined,
      });
      setSuggestions(result);
      setStep(4); // Move to bio selection
    } catch (error: any) {
      alert(error.message || "Failed to generate profile");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    const validLinks = socialLinks.filter((link) => link.platform && link.url);
    onComplete({
      name,
      bio: selectedBio,
      socialMediaLinks: validLinks,
    });
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const updateSocialLink = (
    index: number,
    field: "platform" | "url",
    value: string
  ) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    if (socialLinks.length > 1) {
      setSocialLinks(socialLinks.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {Math.min(step, 4)} of 5
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round((Math.min(step, 5) / 5) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Let's build your profile together! 🚀
              </h2>
              <p className="text-gray-600">
                This will only take 2-3 minutes. We'll help you create a profile
                that attracts brands.
              </p>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                What's your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors text-lg"
                autoFocus
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Step 1/3: What do you create content about?
              </h2>
              <p className="text-gray-600">
                Tell us about your content, niche, or topics you cover
              </p>
            </div>

            <div>
              <textarea
                value={contentDescription}
                onChange={(e) => setContentDescription(e.target.value)}
                placeholder="Example: I make videos about sustainable living, showing realistic ways to reduce waste without being perfect. I focus on affordable eco-swaps and honest reviews of green products..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-2">
                {contentDescription.length} characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={contentDescription.length < 20}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Step 2/3: Who's your audience?
              </h2>
              <p className="text-gray-600">
                Describe who watches your content and why they follow you
              </p>
            </div>

            <div>
              <textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Example: Mainly women ages 25-35 who care about the environment but feel overwhelmed by perfect eco-influencers. They want practical tips they can actually afford and implement..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-2">
                {audience.length} characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3.5)}
                disabled={audience.length < 20}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 3.5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Step 3/3: What makes your content unique?
              </h2>
              <p className="text-gray-600">
                What sets you apart from other creators in your niche?
              </p>
            </div>

            <div>
              <textarea
                value={uniqueValue}
                onChange={(e) => setUniqueValue(e.target.value)}
                placeholder="Example: I don't show a perfect sustainable lifestyle. I'm honest about my struggles and show realistic swaps that actually work. My followers trust me because I'm real, not aspirational..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-2">
                {uniqueValue.length} characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={uniqueValue.length < 20 || isGenerating}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    Generating...
                  </span>
                ) : (
                  "✨ Generate Profile"
                )}
              </button>
            </div>
          </div>
        )}

        {step === 4 && suggestions && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Choose your bio style
              </h2>
              <p className="text-gray-600">
                We've created 3 options for you. Pick one and edit if needed!
              </p>
            </div>

            <BioSelector
              options={suggestions.bioOptions}
              onSelect={setSelectedBio}
              selected={selectedBio}
            />

            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-sm font-medium text-indigo-900 mb-2">
                💡 Suggested Categories:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.suggestedCategories.map((category, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3.5)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                ← Regenerate
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!selectedBio}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Add your social media
              </h2>
              <p className="text-gray-600">
                Help brands find and evaluate your content
              </p>
            </div>

            <div className="space-y-3">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) =>
                      updateSocialLink(index, "platform", e.target.value)
                    }
                    placeholder="Platform (TikTok, Instagram...)"
                    className="w-1/3 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      updateSocialLink(index, "url", e.target.value)
                    }
                    placeholder="Profile URL"
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  {socialLinks.length > 1 && (
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addSocialLink}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                + Add another link
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                disabled={
                  !socialLinks.some((link) => link.platform && link.url)
                }
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
              >
                Complete Profile ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@convex/_generated/api";
import { ProfileCreationWizard } from "../../components/ProfileCreationWizard";
import { CreatorProfileForm } from "../../components/CreatorProfileForm";

export const Route = createFileRoute("/profile/creator")({
  component: CreatorProfilePage,
});

function CreatorProfilePage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <CreatorProfilePageContent />
      </Authenticated>
    </>
  );
}

function CreatorProfilePageContent() {
  const navigate = useNavigate();
  const profile = useQuery(api.creatorProfiles.getCurrentUserProfile);
  const createOrUpdate = useMutation(api.creatorProfiles.createOrUpdate);

  const handleWizardComplete = async (data: {
    name: string;
    bio: string;
    socialMediaLinks: Array<{ platform: string; url: string }>;
  }) => {
    try {
      await createOrUpdate({
        name: data.name,
        bio: data.bio,
        socialMediaLinks: data.socialMediaLinks,
        isComplete: true,
      });
      navigate({ to: "/browse" });
    } catch (error: any) {
      alert(error.message || "Failed to save profile");
    }
  };

  const handleFormComplete = () => {
    navigate({ to: "/browse" });
  };

  // Show wizard for new profiles, form for editing
  if (profile === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      {!profile ? (
        <ProfileCreationWizard onComplete={handleWizardComplete} />
      ) : (
        <CreatorProfileForm onComplete={handleFormComplete} />
      )}
    </div>
  );
}

function RedirectToHome() {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
  return null
}

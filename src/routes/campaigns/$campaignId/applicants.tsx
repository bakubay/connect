import { createFileRoute } from "@tanstack/react-router";
import { ApplicantsList } from "../../../components/ApplicantsList";
import { Authenticated, Unauthenticated } from "convex/react";
import type { Id } from "@convex/_generated/dataModel";

export const Route = createFileRoute("/campaigns/$campaignId/applicants")({
  component: ApplicantsPage,
});

function ApplicantsPage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <ApplicantsPageContent />
      </Authenticated>
    </>
  );
}

function ApplicantsPageContent() {
  const { campaignId } = Route.useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto p-6">
        <ApplicantsList campaignId={campaignId as Id<"campaigns">} />
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

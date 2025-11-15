import { createFileRoute, redirect } from "@tanstack/react-router";
import { CampaignList } from "../../components/CampaignList";
import { Authenticated, Unauthenticated } from "convex/react";

export const Route = createFileRoute("/campaigns/")({
  component: CampaignsPage,
});

function CampaignsPage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
          <CampaignList />
        </div>
      </Authenticated>
    </>
  );
}

function RedirectToHome() {
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
  return null
}


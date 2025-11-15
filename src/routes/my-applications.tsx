import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsList } from "../components/ApplicationsList";
import { Authenticated, Unauthenticated } from "convex/react";

export const Route = createFileRoute("/my-applications")({
  component: MyApplicationsPage,
});

function MyApplicationsPage() {
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
          <ApplicationsList />
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

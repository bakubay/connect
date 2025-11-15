import { createFileRoute } from "@tanstack/react-router";
import { DiagnosticPanel } from "../components/DiagnosticPanel";

export const Route = createFileRoute("/diagnostics")({
  component: DiagnosticsPage,
});

function DiagnosticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <DiagnosticPanel />
    </div>
  );
}

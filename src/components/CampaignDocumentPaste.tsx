import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@convex/_generated/api";
import { FileText, Sparkles } from "lucide-react";

interface ExtractedCampaign {
  title: string;
  description: string;
  criteria: string;
  budget: number;
  deadline: string;
  deliverables?: string;
  suggestedImprovements?: string[];
}

interface CampaignDocumentPasteProps {
  onExtracted: (data: ExtractedCampaign) => void;
}

export function CampaignDocumentPaste({
  onExtracted,
}: CampaignDocumentPasteProps) {
  const [documentText, setDocumentText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const extractCampaign = useAction(api.campaigns.extractFromDocument);

  const handleExtract = async () => {
    if (!documentText.trim()) return;

    setIsExtracting(true);
    try {
      const extracted = await extractCampaign({ documentText });
      onExtracted(extracted);
    } catch (error: any) {
      alert(error.message || "Failed to extract campaign details");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <FileText size={32} className="text-indigo-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Paste Your Campaign Brief
        </h3>
        <p className="text-gray-600">
          Copy your campaign brief, email, or internal doc. AI will structure it
          for you.
        </p>
      </div>

      <div>
        <textarea
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          placeholder={`Paste your campaign brief here...

Example:
"We're launching eco-friendly water bottles. Looking for creators with 10K-100K followers in the sustainability space. Budget is $5K. Need 2 TikToks and 3 IG stories by Dec 15. Target audience is environmentally conscious millennials..."`}
          rows={12}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors resize-none font-mono text-sm"
        />
        <p className="text-sm text-gray-500 mt-2">
          {documentText.length} characters
        </p>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> The more details you provide, the better AI can
          structure your campaign. Include budget, requirements, deadlines, and
          deliverables.
        </p>
      </div>

      <button
        onClick={handleExtract}
        disabled={isExtracting || documentText.length < 50}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
      >
        {isExtracting ? (
          <>
            <span className="animate-spin">⚙️</span>
            <span>Extracting Campaign Details...</span>
          </>
        ) : (
          <>
            <Sparkles size={20} />
            <span>Extract Campaign Details</span>
          </>
        )}
      </button>
    </div>
  );
}


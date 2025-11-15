import { useState } from "react";

interface BioOption {
  style: "professional" | "casual" | "impact_focused";
  text: string;
}

interface BioSelectorProps {
  options: BioOption[];
  selected: string;
  onSelect: (bio: string) => void;
}

export function BioSelector({ options, selected, onSelect }: BioSelectorProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedBio, setEditedBio] = useState("");

  const styleLabels = {
    professional: { label: "Professional", emoji: "💼", color: "blue" },
    casual: { label: "Casual & Friendly", emoji: "😊", color: "purple" },
    impact_focused: { label: "Impact-Focused", emoji: "🎯", color: "green" },
  };

  const handleSelect = (bio: string) => {
    onSelect(bio);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditedBio(selected);
    setEditMode(true);
  };

  const saveEdit = () => {
    onSelect(editedBio);
    setEditMode(false);
  };

  if (editMode) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edit your bio
          </label>
          <textarea
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
            autoFocus
          />
          <p className="text-sm text-gray-500 mt-1">
            {editedBio.length} characters
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        const style = styleLabels[option.style];
        const isSelected = selected === option.text;
        const colorClasses: Record<string, string> = {
          blue: isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-300",
          purple: isSelected
            ? "border-purple-500 bg-purple-50"
            : "border-gray-200 hover:border-purple-300",
          green: isSelected
            ? "border-green-500 bg-green-50"
            : "border-gray-200 hover:border-green-300",
        };

        return (
          <button
            key={index}
            onClick={() => handleSelect(option.text)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              colorClasses[style.color]
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{style.emoji}</span>
                <span className="font-semibold text-gray-800">
                  {style.label}
                </span>
              </div>
              {isSelected && (
                <span className="text-green-600 font-bold">✓ Selected</span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {option.text}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {option.text.length} characters
            </p>
          </button>
        );
      })}

      {selected && !editMode && (
        <button
          onClick={handleEdit}
          className="w-full py-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
        >
          ✏️ Edit selected bio
        </button>
      )}
    </div>
  );
}


import { Copy } from "lucide-react";
import { showToast } from "../utils/sweetAlert";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
}

export const QRControls = ({ value, onChange, onGenerate }: Props) => {
  const copy = () => {
    navigator.clipboard.writeText(value);
    showToast("success", "Copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter text or URL"
        className="w-full h-32 border rounded-lg p-3 resize-none"
      />

      <div className="flex gap-3">
        <button
          onClick={onGenerate}
          className="flex-1 bg-black text-white py-3 rounded-lg"
        >
          Generate QR
        </button>

        {value && (
          <button
            onClick={copy}
            className="px-4 border rounded-lg"
          >
            <Copy size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import type { CountdownSettings } from '../types';
import { getCompressedSize, MAX_SAFE_URL_SIZE } from '../utils/urlCompression';

interface ShareButtonProps {
  settings: CountdownSettings;
  onShare: () => string | null;
}

export function ShareButton({ settings, onShare }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleShare = async () => {
    const size = getCompressedSize(settings);

    if (size > MAX_SAFE_URL_SIZE * 2) {
      // Too large to even attempt
      setShowError(true);
      setTimeout(() => setShowError(false), 8000);
      return;
    }

    if (size > MAX_SAFE_URL_SIZE) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
    }

    const url = onShare();

    if (!url) {
      setShowError(true);
      setTimeout(() => setShowError(false), 8000);
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: select the URL
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sizeKB = Math.round(getCompressedSize(settings) / 1024);
  const photoCount = settings.photos.length;

  return (
    <div className="space-y-2">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
        <p className="text-sm text-blue-800">
          <strong>💾 Auto-Save Enabled:</strong> Your settings are automatically
          saved to this browser. You can refresh the page anytime!
        </p>
      </div>

      <button
        onClick={handleShare}
        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
      >
        {copied ? '✓ Link Copied!' : 'Generate Shareable Link'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Config size: {sizeKB}KB ({photoCount} photo{photoCount !== 1 ? 's' : ''})
        {sizeKB > 50 && sizeKB <= 100 && ' - May not work in all browsers'}
        {sizeKB > 100 && ' - Too large for URL sharing'}
      </p>

      {showWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> Configuration is {sizeKB}KB with {photoCount} photos.
            The URL may not work in all browsers.
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            Tip: For reliable sharing, use 3-5 photos max. Your settings are saved locally regardless.
          </p>
        </div>
      )}

      {showError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> Configuration too large ({sizeKB}KB with {photoCount} photos) to share via URL.
          </p>
          <p className="text-xs text-red-700 mt-1">
            Your settings are saved locally. To share via URL, reduce to 5-10 photos maximum.
          </p>
        </div>
      )}
    </div>
  );
}

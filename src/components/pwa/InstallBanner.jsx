import { useState } from "react";
import { Download, Share, X } from "lucide-react";
import useInstallPrompt from "./useInstallPrompt";

const DISMISS_KEY = "awaitstore-install-dismissed";
const DISMISS_DAYS = 7;

const wasDismissed = () => {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

// "Install AwaitStore" card shown on mobile and desktop until installed or dismissed.
const InstallBanner = () => {
  const { canInstall, showIosHint, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(wasDismissed);

  if (dismissed || (!canInstall && !showIosHint)) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore: banner just reappears next visit
    }
    setDismissed(true);
  };

  return (
    <div className="fixed inset-x-3 bottom-20 z-40 mx-auto flex max-w-md items-center gap-3 rounded-xl border bg-white p-3 shadow-lg md:bottom-4">
      <img src="/icons/icon-192.png" alt="" className="h-11 w-11 rounded-xl" />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-gray-900">Install AwaitStore</p>
        {canInstall ? (
          <p className="text-gray-500">Faster shopping, works offline.</p>
        ) : (
          <p className="text-gray-500">
            Tap <Share className="inline h-4 w-4 align-text-bottom" /> then “Add to Home Screen”.
          </p>
        )}
      </div>
      {canInstall && (
        <button
          onClick={async () => {
            if (await promptInstall()) setDismissed(true);
          }}
          className="flex items-center gap-1 rounded-lg bg-[#26457f] px-3 py-2 text-sm font-semibold text-white"
        >
          <Download className="h-4 w-4" /> Install
        </button>
      )}
      <button onClick={dismiss} aria-label="Dismiss install banner" className="p-1 text-gray-400 hover:text-gray-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default InstallBanner;

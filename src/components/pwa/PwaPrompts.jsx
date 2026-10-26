import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "react-toastify";

// Registers the service worker and asks before switching to a new version.
const UPDATE_CHECK_MS = 60 * 60 * 1000;

const PwaPrompts = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;
      // Long-running installed apps rarely reload, so look for updates periodically
      setInterval(() => {
        if (navigator.onLine) registration.update();
      }, UPDATE_CHECK_MS);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      toast.success("AwaitStore is ready to work offline", { autoClose: 3000 });
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady]);

  if (!needRefresh) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-3 bottom-20 z-[60] mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lg md:bottom-4"
    >
      <span>A new version of AwaitStore is available.</span>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => setNeedRefresh(false)}
          className="rounded-lg px-2 py-1 text-gray-300 hover:text-white"
        >
          Later
        </button>
        <button
          onClick={() => updateServiceWorker(true)}
          className="rounded-lg bg-white px-3 py-1 font-semibold text-gray-900"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default PwaPrompts;

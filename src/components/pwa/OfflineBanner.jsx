import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

const OfflineBanner = () => {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[55] flex items-center justify-center gap-2 bg-amber-500 px-3 py-1.5 text-sm font-medium text-white"
    >
      <WifiOff className="h-4 w-4" /> You’re offline. Browsing saved pages.
    </div>
  );
};

export default OfflineBanner;

import { useEffect, useState } from "react";

// Captures the browser's install prompt so the app can offer its own "Install" button.
// The event can fire before React mounts, so it is caught at module load.
let deferredPrompt = null;
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

export const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

// iPhone/iPad Safari has no install prompt; users add it from the Share menu.
export const isIosSafari = () => {
  const ua = window.navigator.userAgent;
  const ios = /iphone|ipad|ipod/i.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  return ios && /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
};

const useInstallPrompt = () => {
  const [, rerender] = useState(0);

  useEffect(() => {
    const fn = () => rerender((n) => n + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notify();
    return outcome === "accepted";
  };

  return {
    canInstall: !!deferredPrompt && !isStandalone(),
    showIosHint: isIosSafari() && !isStandalone(),
    promptInstall,
  };
};

export default useInstallPrompt;

import { useEffect, useRef } from "react";

// Accessible confirmation modal. Children render between the message and the buttons
// (e.g. a "reason" select); Escape or the backdrop cancels.
const ConfirmDialog = ({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  isLoading = false,
  confirmDisabled = false,
  onConfirm,
  onCancel,
  children,
}) => {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && !isLoading && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel, isLoading]);

  const confirmClass =
    tone === "danger" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-brand-700 hover:bg-brand-800 text-white";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-gray-950/50 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="absolute inset-0" onClick={() => !isLoading && onCancel()} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-3xl"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
      >
        <h2 id="confirm-title" className="text-lg font-bold">{title}</h2>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || confirmDisabled}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${confirmClass}`}
          >
            {isLoading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

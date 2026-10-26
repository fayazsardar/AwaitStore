import { useEffect } from "react";

const BASE = "AwaitStore";

// Sets the browser tab / app switcher title for the current page.
const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} – Protein, Vitamins & Supplements`;
  }, [title]);
};

export default useDocumentTitle;

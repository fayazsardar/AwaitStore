import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import useDocumentTitle from "../utils/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Page not found");

  return (
    <div className="page flex flex-col items-center py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Compass className="h-10 w-10" />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-accent-700">404</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">We couldn't find that page</h1>
      <p className="mt-2 max-w-md text-gray-600">The link may be old or mistyped. Let's get you back to shopping.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800">
          Go to home
        </Link>
        <Link to="/search" className="rounded-full px-6 py-3 text-sm font-semibold text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50">
          Browse products
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

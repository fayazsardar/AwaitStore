import React from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { RefreshCw } from "lucide-react";

// Shown when a page crashes or fails to load (e.g. offline before it was cached)
export const Error404 = () => {
  const err = useRouteError();
  const notFound = isRouteErrorResponse(err) && err.status === 404;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-700">
        {notFound ? "404" : "Something went wrong"}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
        {notFound ? "We couldn't find that page" : "This page didn't load"}
      </h1>
      <p className="mt-2 max-w-md text-gray-600">
        {notFound ? "The link may be old or mistyped." : "Check your connection and try again."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {!notFound && (
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
        )}
        <Link to="/" className="rounded-full px-6 py-3 text-sm font-semibold text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50">
          Go to home
        </Link>
      </div>
      {import.meta.env.DEV && err?.message && <pre className="mt-6 max-w-full overflow-auto text-left text-xs text-red-600">{err.message}</pre>}
    </div>
  );
};

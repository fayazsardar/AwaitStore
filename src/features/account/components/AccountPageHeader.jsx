import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useDocumentTitle from "../../../utils/useDocumentTitle";

// Page title for account sub-pages. On phones it adds a back arrow to the account menu
// (desktop has the sidebar instead).
const AccountPageHeader = ({ title, description, backTo = "/account", actions }) => {
  useDocumentTitle(title);

  return (
    <div className="mb-5 flex items-start gap-3">
      {backTo && (
        <Link
          to={backTo}
          className="-ml-2 mt-0.5 rounded-full p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
};

export default AccountPageHeader;

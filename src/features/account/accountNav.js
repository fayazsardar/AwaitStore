import { LayoutDashboard, MapPin, Package, Settings, UserRound } from "lucide-react";

// Single source for the account navigation (desktop sidebar + mobile menu)
export const ACCOUNT_NAV = [
  { to: "/account", label: "Overview", description: "Your account at a glance", icon: LayoutDashboard, end: true },
  { to: "/account/orders", label: "Orders", description: "Track, cancel or buy again", icon: Package },
  { to: "/account/addresses", label: "Addresses", description: "Saved delivery addresses", icon: MapPin },
  { to: "/account/profile", label: "Profile details", description: "Name, email and personal info", icon: UserRound },
  { to: "/account/settings", label: "Settings", description: "Notifications, security and privacy", icon: Settings },
];

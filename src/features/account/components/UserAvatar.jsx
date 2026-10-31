const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

const UserAvatar = ({ user, size = "md" }) => {
  const box = size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-800 ${box}`} aria-hidden="true">
      {initials(user?.name)}
    </span>
  );
};

export default UserAvatar;

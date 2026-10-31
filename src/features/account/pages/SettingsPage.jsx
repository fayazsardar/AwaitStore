import { useState } from "react";
import { toast } from "react-toastify";
import { Bell, Download, LogOut, ShieldAlert, Smartphone } from "lucide-react";
import { useDeleteAccountMutation, useGetPreferencesQuery, useUpdatePreferencesMutation } from "../api/accountApi";
import AccountPageHeader from "../components/AccountPageHeader";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import useLogout from "../hooks/useLogout";
import useInstallPrompt, { isStandalone } from "../../../components/pwa/useInstallPrompt";

const NOTIFICATIONS = [
  { key: "orderUpdates", label: "Order updates", hint: "Shipping and delivery alerts by SMS" },
  { key: "offers", label: "Offers & deals", hint: "Price drops and sale alerts" },
  { key: "newsletter", label: "Newsletter", hint: "Nutrition tips, once a month" },
];

const Section = ({ title, icon, children }) => {
  const Icon = icon;
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white shadow-card">
      <h2 className="flex items-center gap-2 border-b border-gray-100 px-5 py-4 text-base font-bold">
        <Icon className="h-4 w-4 text-brand-700" /> {title}
      </h2>
      <div className="divide-y divide-gray-100">{children}</div>
    </section>
  );
};

const Switch = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? "bg-brand-700" : "bg-gray-300"}`}
  >
    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
  </button>
);

const Row = ({ label, hint, children }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-4">
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
    {children}
  </div>
);

const CONFIRM_WORD = "DELETE";

const SettingsPage = () => {
  const { data: prefs, isLoading } = useGetPreferencesQuery();
  const [updatePreferences] = useUpdatePreferencesMutation();
  const [deleteAccount, { isLoading: deleting }] = useDeleteAccountMutation();
  const handleLogout = useLogout();
  const { canInstall, promptInstall } = useInstallPrompt();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [typed, setTyped] = useState("");

  const toggle = async (key, value) => {
    try {
      await updatePreferences({ [key]: value }).unwrap();
    } catch {
      toast.error("Couldn't save that setting");
    }
  };

  const handleDelete = async () => {
    if (typed !== CONFIRM_WORD) return;
    try {
      await deleteAccount().unwrap();
      toast.success("Your account has been deleted");
      handleLogout();
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't delete your account");
    }
  };

  return (
    <div className="space-y-5">
      <AccountPageHeader title="Settings" description="Notifications, app and account security" />

      <Section title="Notifications" icon={Bell}>
        {NOTIFICATIONS.map(({ key, label, hint }) => (
          <Row key={key} label={label} hint={hint}>
            {isLoading ? (
              <span className="skeleton h-6 w-11 rounded-full" />
            ) : (
              <Switch label={label} checked={Boolean(prefs?.[key])} onChange={(v) => toggle(key, v)} />
            )}
          </Row>
        ))}
      </Section>

      <Section title="App" icon={Smartphone}>
        <Row
          label="AwaitStore app"
          hint={isStandalone() ? "You're using the installed app" : "Install for faster shopping and offline access"}
        >
          {canInstall && (
            <button onClick={promptInstall} className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-brand-800">
              <Download className="h-4 w-4" /> Install
            </button>
          )}
        </Row>
      </Section>

      <Section title="Security & privacy" icon={ShieldAlert}>
        <Row label="Log out" hint="Sign out of AwaitStore on this device">
          <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </Row>
        <Row label="Delete account" hint="Permanently remove your profile, addresses and order history">
          <button onClick={() => setConfirmDelete(true)} className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50">
            Delete
          </button>
        </Row>
      </Section>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete your account?"
          message="This permanently deletes your profile, saved addresses and order history. It can't be undone."
          confirmLabel="Delete account"
          isLoading={deleting}
          confirmDisabled={typed !== CONFIRM_WORD}
          onConfirm={handleDelete}
          onCancel={() => {
            setConfirmDelete(false);
            setTyped("");
          }}
        >
          <label className="block text-sm text-gray-700">
            Type <strong>{CONFIRM_WORD}</strong> to confirm
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value.toUpperCase())}
              autoCapitalize="characters"
              className="mt-1 h-11 w-full rounded-xl border border-gray-300 px-3 text-sm tracking-widest outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100"
            />
          </label>
          {typed && typed !== CONFIRM_WORD && <p className="mt-1 text-xs text-gray-500">Keep typing…</p>}
        </ConfirmDialog>
      )}
    </div>
  );
};

export default SettingsPage;

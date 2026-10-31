import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Lock } from "lucide-react";
import { useGetProfileQuery, useUpdateProfileMutation } from "../api/accountApi";
import AccountPageHeader from "../components/AccountPageHeader";
import { updateUser } from "../../../store/slices/authSlice";

const GENDERS = ["Female", "Male", "Other", "Prefer not to say"];
const FIELDS = ["name", "email", "gender", "dob"];

const inputClass = (error) =>
  `h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-4 ${
    error ? "border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-brand-500 focus:ring-brand-100"
  }`;

const pick = (user) => Object.fromEntries(FIELDS.map((k) => [k, user?.[k] ?? ""]));

const validate = (f) => {
  const errors = {};
  if (f.name.trim().length < 2) errors.name = "Enter your full name";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = "Enter a valid email address";
  if (f.dob && new Date(f.dob) > new Date()) errors.dob = "Date of birth can't be in the future";
  return errors;
};

const ProfileForm = ({ user }) => {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [saved, setSaved] = useState(() => pick(user));
  const [form, setForm] = useState(saved);
  const [errors, setErrors] = useState({});
  const dirty = FIELDS.some((k) => form[k] !== saved[k]);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    try {
      const res = await updateProfile({ ...form, name: form.name.trim(), email: form.email.trim() }).unwrap();
      dispatch(updateUser(res.user));
      setSaved(pick(res.user));
      setForm(pick(res.user));
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't save your profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-gray-200/80 bg-white shadow-card">
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">Full name</span>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={inputClass(errors.name)} />
          {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
        </label>

        <div>
          <span className="mb-1 block text-sm font-medium text-gray-700">Mobile number</span>
          <div className="flex h-11 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
            <span>+91 {user?.mobileNumber}</span>
            <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <span className="mt-1 block text-xs text-gray-500">Used to log in, so it can't be changed here.</span>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Email <span className="font-normal text-gray-400">(optional)</span></span>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" className={inputClass(errors.email)} />
          {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
        </label>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-700">Gender <span className="font-normal text-gray-400">(optional)</span></legend>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={form.gender === g}
                onClick={() => set("gender", form.gender === g ? "" : g)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition ${form.gender === g ? "bg-brand-700 text-white ring-brand-700" : "text-gray-700 ring-gray-300 hover:bg-gray-50"}`}
              >
                {g}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Date of birth <span className="font-normal text-gray-400">(optional)</span></span>
          <input
            type="date"
            value={form.dob}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => set("dob", e.target.value)}
            autoComplete="bday"
            className={inputClass(errors.dob)}
          />
          {errors.dob && <span className="mt-1 block text-xs text-red-600">{errors.dob}</span>}
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-4 sm:px-6">
        {dirty && (
          <button type="button" onClick={() => { setForm(saved); setErrors({}); }} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100">
            Discard
          </button>
        )}
        <button type="submit" disabled={!dirty || isLoading} className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
};

const ProfilePage = () => {
  const { data: user, isLoading, isError, refetch } = useGetProfileQuery();

  return (
    <div>
      <AccountPageHeader title="Profile details" description="Keep your details up to date for smoother deliveries" />
      {isLoading ? (
        <div className="skeleton h-80 rounded-2xl" />
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Couldn't load your profile. <button onClick={refetch} className="font-semibold underline">Try again</button>
        </div>
      ) : (
        <ProfileForm key={user?._id} user={user} />
      )}
    </div>
  );
};

export default ProfilePage;

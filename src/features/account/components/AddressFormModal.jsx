import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useAddAddressMutation, useUpdateAddressMutation } from "../api/accountApi";

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];
const TYPES = ["Home", "Work", "Other"];

const EMPTY = {
  firstName: "", lastName: "", mobileNumber: "", altPhoneNo: "", email: "",
  pincode: "", city: "", state: "", addressLine: "", landmark: "", addressType: "Home", defaultAddress: false,
};

const validate = (f) => {
  const errors = {};
  if (!f.firstName.trim()) errors.firstName = "Enter a first name";
  if (!/^[6-9]\d{9}$/.test(f.mobileNumber)) errors.mobileNumber = "Enter a valid 10-digit mobile number";
  if (f.altPhoneNo && !/^[6-9]\d{9}$/.test(f.altPhoneNo)) errors.altPhoneNo = "Enter a valid 10-digit number";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = "Enter a valid email";
  if (!/^[1-9]\d{5}$/.test(f.pincode)) errors.pincode = "Enter a valid 6-digit PIN code";
  if (!f.city.trim()) errors.city = "Enter a city";
  if (!f.state) errors.state = "Choose a state";
  if (f.addressLine.trim().length < 5) errors.addressLine = "Enter house number, building and street";
  return errors;
};

const inputClass = (error) =>
  `h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-4 ${
    error ? "border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-brand-500 focus:ring-brand-100"
  }`;

const Field = ({ label, error, optional, children }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-gray-700">
      {label} {optional && <span className="font-normal text-gray-400">(optional)</span>}
    </span>
    {children}
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

// Add (no `address`) or edit (`address` given) a saved address.
// onSaved receives the saved address, e.g. so checkout can select it.
const AddressFormModal = ({ address, onClose, onSaved }) => {
  const editing = Boolean(address?._id);
  const [form, setForm] = useState(() => ({ ...EMPTY, ...address }));
  const [errors, setErrors] = useState({});
  const [addAddress, { isLoading: adding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const saving = adding || updating;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === "checkbox" ? checked : value);
  };
  const digits = (max) => (e) => set(e.target.name, e.target.value.replace(/\D/g, "").slice(0, max));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    try {
      const res = editing
        ? await updateAddress({ id: address._id, ...form }).unwrap()
        : await addAddress(form).unwrap();
      toast.success(editing ? "Address updated" : "Address added");
      onSaved?.(res.address);
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't save the address. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/50 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <form
        onSubmit={handleSubmit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-form-title"
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 id="address-form-title" className="text-lg font-bold">{editing ? "Edit address" : "Add a new address"}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2">
          <Field label="First name" error={errors.firstName}>
            <input name="firstName" value={form.firstName} onChange={onChange} autoComplete="given-name" className={inputClass(errors.firstName)} />
          </Field>
          <Field label="Last name" optional>
            <input name="lastName" value={form.lastName} onChange={onChange} autoComplete="family-name" className={inputClass()} />
          </Field>
          <Field label="Mobile number" error={errors.mobileNumber}>
            <input name="mobileNumber" value={form.mobileNumber} onChange={digits(10)} inputMode="numeric" autoComplete="tel-national" className={inputClass(errors.mobileNumber)} />
          </Field>
          <Field label="Alternate number" optional error={errors.altPhoneNo}>
            <input name="altPhoneNo" value={form.altPhoneNo} onChange={digits(10)} inputMode="numeric" className={inputClass(errors.altPhoneNo)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="House no., building, street" error={errors.addressLine}>
              <input name="addressLine" value={form.addressLine} onChange={onChange} autoComplete="street-address" className={inputClass(errors.addressLine)} />
            </Field>
          </div>
          <Field label="Landmark" optional>
            <input name="landmark" value={form.landmark} onChange={onChange} className={inputClass()} />
          </Field>
          <Field label="PIN code" error={errors.pincode}>
            <input name="pincode" value={form.pincode} onChange={digits(6)} inputMode="numeric" autoComplete="postal-code" className={inputClass(errors.pincode)} />
          </Field>
          <Field label="City" error={errors.city}>
            <input name="city" value={form.city} onChange={onChange} autoComplete="address-level2" className={inputClass(errors.city)} />
          </Field>
          <Field label="State" error={errors.state}>
            <select name="state" value={form.state} onChange={onChange} autoComplete="address-level1" className={inputClass(errors.state)}>
              <option value="">Select state</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Email" optional error={errors.email}>
              <input name="email" type="email" value={form.email} onChange={onChange} autoComplete="email" className={inputClass(errors.email)} />
            </Field>
          </div>

          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-sm font-medium text-gray-700">Save as</legend>
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("addressType", t)}
                  aria-pressed={form.addressType === t}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition ${form.addressType === t ? "bg-brand-700 text-white ring-brand-700" : "text-gray-700 ring-gray-300 hover:bg-gray-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          {!address?.defaultAddress && (
            <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
              <input type="checkbox" name="defaultAddress" checked={form.defaultAddress} onChange={onChange} className="h-4 w-4 rounded accent-brand-700" />
              Make this my default address
            </label>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-white">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
            {saving ? "Saving…" : editing ? "Save changes" : "Save address"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressFormModal;

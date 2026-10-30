import { useState } from "react";
import { toast } from "react-toastify";
import { MapPin, Pencil, Phone, Plus, Star, Trash2 } from "lucide-react";
import { useDeleteAddressMutation, useGetAddressesQuery, useSetDefaultAddressMutation } from "../api/accountApi";
import AccountPageHeader from "../components/AccountPageHeader";
import AddressFormModal from "../components/AddressFormModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

const actionClass = "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition disabled:opacity-50";

const AddressesPage = () => {
  const { data: addresses = [], isLoading, isError, refetch } = useGetAddressesQuery();
  const [setDefault, { isLoading: settingDefault, originalArgs: defaultingId }] = useSetDefaultAddressMutation();
  const [deleteAddress, { isLoading: deleting }] = useDeleteAddressMutation();
  const [editing, setEditing] = useState(null); // null = closed, {} = new, address = edit
  const [toDelete, setToDelete] = useState(null);

  // Default address first, then newest
  const sorted = [...addresses].sort((a, b) => Number(b.defaultAddress) - Number(a.defaultAddress));

  const handleSetDefault = async (id) => {
    try {
      await setDefault(id).unwrap();
      toast.success("Default address updated");
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't update the default address");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAddress(toDelete._id).unwrap();
      toast.success("Address deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't delete the address");
    }
  };

  return (
    <div>
      <AccountPageHeader
        title="Addresses"
        description="Where we deliver your orders"
        actions={
          <button
            onClick={() => setEditing({})}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add address</span><span className="sm:hidden">Add</span>
          </button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="skeleton h-44 rounded-2xl" />
          <div className="skeleton h-44 rounded-2xl" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Couldn't load your addresses. <button onClick={refetch} className="font-semibold underline">Try again</button>
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <MapPin className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-3 font-semibold">No saved addresses yet</p>
          <p className="mt-1 text-sm text-gray-500">Add one now to check out faster.</p>
          <button onClick={() => setEditing({})} className="mt-5 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
            Add address
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {sorted.map((a) => (
            <li
              key={a._id}
              className={`flex flex-col rounded-2xl border bg-white p-5 shadow-card ${a.defaultAddress ? "border-brand-300 ring-1 ring-brand-200" : "border-gray-200/80"}`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">{a.firstName} {a.lastName}</h2>
                {a.addressType && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{a.addressType}</span>}
                {a.defaultAddress && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">
                    <Star className="h-3 w-3 fill-current" /> Default
                  </span>
                )}
              </div>
              <p className="text-sm leading-6 text-gray-600">
                {a.addressLine}
                {a.landmark ? `, ${a.landmark}` : ""}
                <br />
                {a.city}, {a.state} – {a.pincode}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                <Phone className="h-3.5 w-3.5 text-gray-400" /> {a.mobileNumber}
              </p>

              <div className="mt-4 flex flex-wrap gap-1 border-t border-gray-100 pt-3">
                <button onClick={() => setEditing(a)} className={`${actionClass} text-gray-700 hover:bg-gray-100`}>
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                {!a.defaultAddress && (
                  <button
                    onClick={() => handleSetDefault(a._id)}
                    disabled={settingDefault}
                    className={`${actionClass} text-brand-700 hover:bg-brand-50`}
                  >
                    <Star className="h-4 w-4" /> {settingDefault && defaultingId === a._id ? "Saving…" : "Set as default"}
                  </button>
                )}
                <button onClick={() => setToDelete(a)} className={`${actionClass} ml-auto text-red-600 hover:bg-red-50`}>
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && <AddressFormModal address={editing._id ? editing : null} onClose={() => setEditing(null)} />}

      {toDelete && (
        <ConfirmDialog
          title="Delete this address?"
          message={`${toDelete.addressLine}, ${toDelete.city}. ${toDelete.defaultAddress && addresses.length > 1 ? "Another address will become your default." : ""}`}
          confirmLabel="Delete"
          isLoading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
};

export default AddressesPage;

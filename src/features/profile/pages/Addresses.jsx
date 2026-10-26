import { toast } from "react-toastify";
import { useState } from "react";
import { MapPin, Phone, Plus, Trash2 } from "lucide-react";
import { useDeleteAddressMutation, useGetAddressesQuery } from "../api/profileApi";
import AddAddressModal from "../components/AddAddressModal";
import useDocumentTitle from "../../../utils/useDocumentTitle";

const Addresses = () => {
  useDocumentTitle("Addresses");
  const [isAddAddressModal, setIsAddAddressModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteAddress] = useDeleteAddressMutation();
  const { data: addressData, isLoading, isError } = useGetAddressesQuery();

  const handleDeleteAddress = async (id) => {
    setDeletingId(id);
    try {
      await deleteAddress(id).unwrap();
      toast.success("Address deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't delete address");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight">My addresses</h1>
        <button
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
          onClick={() => setIsAddAddressModal(true)}
        >
          <Plus className="h-4 w-4" /> Add address
        </button>
      </div>

      {isAddAddressModal && <AddAddressModal handelClose={() => setIsAddAddressModal(false)} />}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="skeleton h-40 rounded-2xl" />
          <div className="skeleton h-40 rounded-2xl" />
        </div>
      )}
      {isError && <p className="text-red-600">Failed to load addresses.</p>}

      {addressData?.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {addressData.map((a) => (
            <div key={a._id} className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-card">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-base font-semibold">{a.firstName} {a.lastName}</h2>
                {a.addressType && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{a.addressType}</span>
                )}
                {a.defaultAddress && (
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">Default</span>
                )}
              </div>
              <p className="flex gap-2 text-sm text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span>
                  {a.addressLine}
                  {a.landmark ? `, ${a.landmark}` : ""}
                  <br />
                  {a.city}, {a.state} – {a.pincode}
                </span>
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" /> {a.mobileNumber}
              </p>
              <div className="mt-4 flex justify-end border-t border-gray-100 pt-3">
                <button
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  onClick={() => handleDeleteAddress(a._id)}
                  disabled={deletingId === a._id}
                >
                  <Trash2 className="h-4 w-4" /> {deletingId === a._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && !isError && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <MapPin className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 font-semibold">No saved addresses yet</p>
            <p className="text-sm text-gray-500">Add one to check out faster.</p>
          </div>
        )
      )}
    </div>
  );
};

export default Addresses;

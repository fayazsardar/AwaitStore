// Toast body shown after adding to cart, with a shortcut to open the cart drawer
// (react-toastify passes closeToast to the element it renders)
const AddedToast = ({ name, onView, closeToast }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-sm">
      <strong className="font-semibold">{name}</strong> added to cart
    </span>
    <button
      onClick={() => {
        closeToast?.();
        onView();
      }}
      className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
      View cart
    </button>
  </div>
);

export default AddedToast;

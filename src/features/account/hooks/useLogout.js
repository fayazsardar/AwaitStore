import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../store/slices/authSlice";
import { clearGuestCart } from "../../../store/slices/cartSlice";
import privateApiSlice from "../../../app/api/privateApiSlice";

// Logs out and drops every cached private response, so the next user on this
// device never sees the previous user's orders, addresses or profile.
const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return () => {
    dispatch(logout());
    dispatch(clearGuestCart());
    dispatch(privateApiSlice.util.resetApiState());
    navigate("/", { replace: true });
  };
};

export default useLogout;

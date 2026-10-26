import { createSlice } from "@reduxjs/toolkit";

// App-wide UI state, so any component (e.g. "Add to cart" toasts) can open the cart drawer.
const uiSlice = createSlice({
  name: "ui",
  initialState: { cartOpen: false },
  reducers: {
    openCart: (state) => {
      state.cartOpen = true;
    },
    closeCart: (state) => {
      state.cartOpen = false;
    },
  },
});

export const { openCart, closeCart } = uiSlice.actions;
export default uiSlice.reducer;

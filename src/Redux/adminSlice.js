import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isAuthenticated: false,
    admin: null,
  },
  reducers: {
    loginAdmin: (state, action) => {
      state.isAuthenticated = true;
      state.admin = action.payload;
    },
    logoutAdmin: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
    },
  },
});

export const { loginAdmin, logoutAdmin } = adminSlice.actions;

export const selectAdmin = (state) => state.admin.admin;

export default adminSlice.reducer;

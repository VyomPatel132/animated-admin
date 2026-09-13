import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Theme } from "../../types";
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: (localStorage.getItem("aperture-theme") || "dark") as Theme,
    collapsed: false,
    mobileOpen: false,
    commandOpen: false,
    toast: "",
  },
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.collapsed = !state.collapsed;
    },
    setMobileOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileOpen = action.payload;
    },
    setCommandOpen: (state, action: PayloadAction<boolean>) => {
      state.commandOpen = action.payload;
    },
    notify: (state, action: PayloadAction<string>) => {
      state.toast = action.payload;
    },
  },
});
export const {
  setTheme,
  toggleSidebar,
  setMobileOpen,
  setCommandOpen,
  notify,
} = uiSlice.actions;
export default uiSlice.reducer;

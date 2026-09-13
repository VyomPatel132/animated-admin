import { configureStore } from "@reduxjs/toolkit";
import ui from "./slices/uiSlice";
import dashboard from "./slices/dashboardSlice";
import notifications from "./slices/notificationSlice";
import auth from "./slices/authSlice";
export const store = configureStore({
  reducer: { ui, dashboard, notifications, auth },
});
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("aperture-theme", state.ui.theme);
  localStorage.setItem("aperture-signed-out", String(!state.auth.signedIn));
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

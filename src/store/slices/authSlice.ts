import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "auth",
  initialState: {
    user: {
      name: "Alex Morgan",
      email: "alex@aperture.co",
      role: "Workspace admin",
    },
    signedIn: localStorage.getItem("aperture-signed-out") !== "true",
  },
  reducers: {
    signIn: (state, action: PayloadAction<string>) => {
      state.user.email = action.payload;
      state.signedIn = true;
    },
    signOut: (state) => {
      state.signedIn = false;
    },
    updateProfile: (
      state,
      action: PayloadAction<{ name: string; email: string }>,
    ) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});
export const { signIn, signOut, updateProfile } = slice.actions;
export default slice.reducer;

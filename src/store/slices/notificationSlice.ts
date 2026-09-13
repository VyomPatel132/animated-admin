import { createSlice } from "@reduxjs/toolkit";
import type { Notification } from "../../types";
const initialState: { items: Notification[] } = {
  items: [
    {
      id: 1,
      title: "You’re off to a great start",
      detail: "Revenue is up 18.6% compared to last month.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      title: "New order received",
      detail: "Olivia Rhye ordered Studio Headphones.",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 3,
      title: "Stock running low",
      detail: "Orbit Desk Lamp has 12 units remaining.",
      time: "1 hour ago",
      read: false,
    },
  ],
};
const slice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAllRead: (state) => {
      state.items.forEach((item) => {
        item.read = true;
      });
    },
  },
});
export const { markAllRead } = slice.actions;
export default slice.reducer;

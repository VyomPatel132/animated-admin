import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { records } from "../../data/mock";
import type { RecordItem } from "../../types";
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { orders: records, period: "Last 30 days" },
  reducers: {
    setPeriod: (state, action: PayloadAction<string>) => {
      state.period = action.payload;
    },
    addOrder: (state, action: PayloadAction<RecordItem>) => {
      state.orders.unshift(action.payload);
    },
    updateStatus: (
      state,
      action: PayloadAction<{ ids: string[]; status: RecordItem["status"] }>,
    ) => {
      state.orders.forEach((order) => {
        if (action.payload.ids.includes(order.id))
          order.status = action.payload.status;
      });
    },
  },
});
export const { setPeriod, addOrder, updateStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;

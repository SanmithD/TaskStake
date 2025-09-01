import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";

export const UseFundStore = create((set) => ({
  isLoading: false,
  funds: null,

  addFund: async (amount) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(`/fund/add`, {amount});
      console.log(response);
      set({ isLoading: false })
    } catch (error) {
      console.log(error);
      if (error.response) {
        const msg = error.response.data?.msg || "Fund failed";
        toast.error(msg);
      }
      set({ isLoading: false, isAuthenticated: false });
      throw error;
    }
  },
}));

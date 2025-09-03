import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";

export const UseFundStore = create((set) => ({
  isLoading: false,
  funds: null,

  addFund: async (amount) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post(`/fund/add`, {amount});
      set({ isLoading: false });
      toast.success("Fund added")
    } catch (error) {
      console.log(error);
      if (error.response) {
        const msg = error.response.data?.msg || "Fund failed";
        toast.error(msg);
      }
      set({ isLoading: false });
      throw error;
    }
  },

  getRecentFund: async() =>{
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/fund/get`);
      set({ isLoading: false, funds: response.data.data });
    } catch (error) {
      console.log(error);
      if (error.response) {
        const msg = error.response.data?.msg || "Fund failed";
        toast.error(msg);
      }
      set({ isLoading: false });
      throw error;
    }
  }
}));

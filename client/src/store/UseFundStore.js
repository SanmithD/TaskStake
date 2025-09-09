import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import { UseAuthStore } from "./UseAuthStore";

export const UseFundStore = create((set, get) => ({
  isLoading: false,
  funds: null,
  capital: null,
  withdraw: null,
  isFundLoading: false,

  addFund: async (amount) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post(`/fund/add`, {amount});
      set({ isLoading: false });
      await get().getRecentFund();
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
  },

  getWithdrawFund: async() =>{
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/fund/history`);
      set({ isLoading: false, withdraw: response.data.data });
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

  withdrawAmount: async( amount ) =>{
    set({ isFundLoading: true });
    try {
      await axiosInstance.post(`/fund/withdraw`,{ amount });
      set({ isFundLoading: false });
      await get().getWithdrawFund();
      await UseAuthStore.getState().profile();
    } catch (error) {
      console.log(error);
      if (error.response) {
        const msg = error.response.data?.msg || "Fund failed";
        toast.error(msg);
      }
      set({ isFundLoading: false });
      throw error;
    }
  },

  getFund: async() =>{
    set({ isFundLoading: true });
    try {
      const response = await axiosInstance.get(`/fund/get`);
      set({ isFundLoading: false, capital: response.data.data.amount });
    } catch (error) {
      console.log(error);
      if (error.response) {
        const msg = error.response.data?.msg || "Fund failed";
        toast.error(msg);
      }
      set({ isFundLoading: false });
      throw error;
    }
  }
}));

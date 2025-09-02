import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import { UseAuthStore } from "./UseAuthStore";
import { UseTaskStore } from "./UseTaskStore";

export const UseSubmissionStore = create((set, get) => ({
  isSubLoading: false,

  cancelTask: async (taskId) => {
    set({ isSubLoading: true });
    try {
      await axiosInstance.post(`/submission/cancel/${taskId}`);
      set({ isSubLoading: false });
      await UseAuthStore.getState().profile();
      await UseTaskStore.getState().getAllTasks();
      toast.success("Task cancelled");
    } catch (error) {
      const msg =
        error.response?.data?.msg || error.message || "Something went wrong";
      toast.error(msg);
      set({ isSubLoading: false })
    }
  },

  submitTask: async(data, taskId) =>{
    set({ isSubLoading: true });
    try {
      await axiosInstance.post(`/submission/create/${taskId}`,data);
      set({ isSubLoading: false });
      toast.success("Task cancelled");
    } catch (error) {
      const msg =
        error.response?.data?.msg || error.message || "Something went wrong";
      toast.error(msg);
      set({ isSubLoading: false })
    }
  }
}));

import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";

export const UseTaskStore = create((set) => ({
  isLoading: false,
  allTasks: null,

  addTask: async (data) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post(`/task/add`, data);
      set({ isLoading: false });
      toast.success("New Task Added")
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.msg || error.message || "Something went wrong";
      toast.error(msg);
    }
  },
}));

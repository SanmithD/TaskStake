import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";

export const UseTaskStore = create((set, get) => ({
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
  getAllTasks: async() =>{
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/task/get`);
      set({ isLoading: false, allTasks: response.data.data });
      console.log(response.data);
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.msg || error.message || "Something went wrong";
      toast.error(msg);
    }
  },

  updateTask: async(data, id) =>{
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/task/update/${id}`,data);
      set({ isLoading: false});
      await get().getAllTasks();
      console.log(response.data);
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.msg || error.message || "Something went wrong";
      toast.error(msg);
    }
  }
}));

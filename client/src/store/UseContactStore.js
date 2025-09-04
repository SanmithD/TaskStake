import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";

export const UseContactStore = create((set) => ({
  isLoading: false,

  sendMail: async (data) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/contact/send", data);
      set({ isLoading: false });
      toast.success("Mail sent");
    } catch (error) {
      const msg =
        error.response?.data?.msg || error.message || "Something went wrong";
      toast.error(msg);
      set({ isLoading : false })
    }
  },
}));

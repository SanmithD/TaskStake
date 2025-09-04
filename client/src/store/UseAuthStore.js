import { toast } from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance.js";

export const UseAuthStore = create((set, get) => ({
  isLoading: false,
  auth: null,
  isAuthenticated: false,
  hasCheckedAuth: false,

  signup: async (data, navigate) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({
        isAuthenticated: true,
        isLoading: false,
        auth: response.data,
      });
      navigate('/');
      toast.success("Signup success");
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false });
      console.error(error);
      if (error.response) {
        const msg = error.response.data?.msg || "Login failed";
        toast.error(msg);
      }
    }
  },

  login: async (data, navigate) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({
        isAuthenticated: true,
        isLoading: false,
        auth: res.data.data ?? res.data,
      });
      navigate('/');
      toast.success("Login success")
    } catch (error) {
      console.error(error);
      if (error.response) {
        const msg = error.response.data?.msg || "Login failed";
        toast.error(msg);
      }
      set({ isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  logout: async (navigate) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      set({ isAuthenticated: false, auth: null, isLoading: false });
      navigate('/login')
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error("Something went wrong");
    }
  },

  profile: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/auth/profile");
      set({
        isLoading: false,
        auth: response.data.data,
        isAuthenticated: true,
        hasCheckedAuth: true,
      });
    } catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        auth: null,
        hasCheckedAuth: true,
      });
      console.log(error);
    }
  },

  deleteAccount: async (navigate) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete("/auth/delete");
      set({ isLoading: false, isAuthenticated: false, auth: null });
      toast.success("Account delete");
      navigate('/signup')
    } catch (error) {
      const msg =
        error.response?.data?.msg || error.message || "Something went wrong";
      toast.error(msg);
    }
  },

  updateProfile: async(data) =>{
    set({ isLoading: true });
    try {
      await axiosInstance.put("/auth/update", data);
      set({ isLoading: false, isAuthenticated: true});
      await get().profile();
      toast.success("Profile updated");
    } catch (error) {
      const msg =
        error.response?.data?.msg || error.message || "Something went wrong";
      toast.error(msg);
    }
  },

  getSubmittedTask: async() =>{
    set({ isLoading: true });
    try {
      await axiosInstance.get("/submission/mine");
      set({ isLoading: false});
      await get().profile();
      toast.success("Profile updated");
    } catch (error) {
      const msg =
        error.response?.data?.msg || error.message || "Something went wrong";
      toast.error(msg);
    }
  }
}));

import { User } from "../types";
import { apiClient } from "./client";

export const usersApi = {
  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  login: async (
    phone: string,
    password: string,
    role: "farmer" | "buyer",
  ): Promise<{ user: User; token: string }> => {
    const { data } = await apiClient.post('/auth/login', { phone, password, role });
    return data;
  },

  register: async (data: {
    name: string;
    phone: string;
    password: string;
    role: "farmer" | "buyer";
    district: string;
  }): Promise<{ user: User; token: string }> => {
    const { data: response } = await apiClient.post('/auth/register', data);
    return response;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const { data: response } = await apiClient.put('/users/me', data);
    return response;
  },

  getDistricts: async (): Promise<string[]> => {
    const { data } = await apiClient.get('/users/districts');
    return data;
  },
};

import { User } from "../types";
import { DEMO_ACCOUNTS, DEMO_TOKEN, findDemoAccount } from "../constants/demoCredentials";

// Simulate network delay for realistic demo feel
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export const usersApi = {
  getCurrentUser: async (): Promise<User> => {
    await delay();
    return DEMO_ACCOUNTS[0].user;
  },

  login: async (
    emailOrPhone: string,
    password: string,
    role: "farmer" | "buyer",
  ): Promise<{ user: User; token: string }> => {
    await delay(600);
    const account = findDemoAccount(emailOrPhone, password);
    if (account) {
      return { user: account.user, token: DEMO_TOKEN };
    }
    // Fallback: accept any credentials for demo flexibility
    const fallback = DEMO_ACCOUNTS.find((a) => a.role === role) || DEMO_ACCOUNTS[0];
    return { user: fallback.user, token: DEMO_TOKEN };
  },

  register: async (data: {
    name: string;
    phone: string;
    password: string;
    role: "farmer" | "buyer";
    district: string;
  }): Promise<{ user: User; token: string }> => {
    await delay(800);
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      role: data.role,
      location: {
        lat: 0.3476,
        lng: 32.5825,
        address: data.district,
        district: data.district,
        state: "Central Region",
      },
      rating: 0,
      totalSales: 0,
      joinedDate: new Date().toISOString(),
      isVerified: false,
    };
    return { user: newUser, token: DEMO_TOKEN };
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    await delay();
    return { ...DEMO_ACCOUNTS[0].user, ...data };
  },

  getDistricts: async (): Promise<string[]> => {
    await delay(200);
    return [
      "Kampala", "Wakiso", "Mukono", "Jinja", "Mbale", "Gulu",
      "Lira", "Mbarara", "Kasese", "Fort Portal", "Soroti", "Arua",
      "Masaka", "Entebbe", "Kabale", "Hoima", "Tororo", "Iganga",
    ];
  },
};

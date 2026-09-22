import { User } from "../types";

export interface DemoAccount {
  email: string;
  password: string;
  phone: string;
  role: "farmer" | "buyer";
  label: string;
  description: string;
  user: User;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "farmer@demo.com",
    password: "demo123",
    phone: "772100001",
    role: "farmer",
    label: "Demo Farmer",
    description: "John Ssekandi – Maize & Beans farmer from Kampala",
    user: {
      id: "demo-farmer-001",
      name: "John Ssekandi",
      phone: "+256772100001",
      role: "farmer",
      location: {
        lat: 0.3476,
        lng: 32.5825,
        address: "Nakawa, Kampala",
        district: "Kampala",
        state: "Central Region",
      },
      rating: 4.7,
      totalSales: 38,
      joinedDate: "2023-03-15T00:00:00.000Z",
      isVerified: true,
    },
  },
  {
    email: "buyer@demo.com",
    password: "demo123",
    phone: "772100002",
    role: "buyer",
    label: "Demo Buyer",
    description: "Sarah Nakato – Wholesale buyer from Wakiso",
    user: {
      id: "demo-buyer-001",
      name: "Sarah Nakato",
      phone: "+256772100002",
      role: "buyer",
      location: {
        lat: 0.3988,
        lng: 32.4432,
        address: "Nansana, Wakiso",
        district: "Wakiso",
        state: "Central Region",
      },
      rating: 4.2,
      joinedDate: "2023-07-20T00:00:00.000Z",
      isVerified: true,
    },
  },
];

export const DEMO_TOKEN = "demo-jwt-token-agriconnect-2024";

export const findDemoAccount = (
  emailOrPhone: string,
  password: string,
): DemoAccount | null => {
  return (
    DEMO_ACCOUNTS.find(
      (a) =>
        (a.email === emailOrPhone.toLowerCase() ||
          a.phone === emailOrPhone.replace(/\s/g, "")) &&
        a.password === password,
    ) || null
  );
};

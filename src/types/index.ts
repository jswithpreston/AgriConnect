export type UserRole = "farmer" | "buyer";

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
    state: string;
  };
  rating: number;
  totalSales?: number;
  joinedDate: string;
  isVerified: boolean;
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmer: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    isVerified: boolean;
    location: {
      lat: number;
      lng: number;
      district: string;
    };
  };
  crop: string;
  variety: string;
  quantity: number;
  unit: string;
  price: number;
  pricePer: string;
  quality: "A" | "B" | "C";
  harvestDate: string;
  images: string[];
  description: string;
  location: {
    lat: number;
    lng: number;
    district: string;
    state: string;
  };
  isAvailable: boolean;
  createdAt: string;
  views: number;
}

export interface ChatConversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    role: UserRole;
    isOnline: boolean;
  }[];
  lastMessage: {
    text: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
  listingId?: string;
  listing?: {
    crop: string;
    quantity: string;
    price: string;
  };
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

// --- WEATHER TYPES ---

export interface WeatherAlert {
  id: string;
  type: "warning" | "info" | "danger";
  title: string;
  message: string;
}

export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  state?: string;
  country?: string;
}

export interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDir: string;
    condition: string;
    icon: string;
    weatherCode: number;
  };
  hourly: {
    time: string;
    temp: number;
    condition: string;
    icon: string;
    precipitation: number;
    weatherCode: number;
  }[];
  daily: {
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    icon: string;
    precipitation: number;
    weatherCode: number;
  }[];
  alerts: WeatherAlert[];
}

// --- FILTER TYPES ---

export interface FilterState {
  crop: string;
  minPrice: number | null;
  maxPrice: number | null;
  distance: number;
  quality: string;
  sortBy: "nearest" | "price_low" | "price_high" | "newest";
  district: string;
  isAvailable?: boolean;
}

export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  illustration: string;
}

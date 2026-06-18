import { CropListing, ChatConversation, ChatMessage, WeatherData } from "../types";

// ─── MOCK LISTINGS ────────────────────────────────────────────────────────────

export const MOCK_LISTINGS: CropListing[] = [
  {
    id: "listing-001",
    farmerId: "demo-farmer-001",
    farmer: {
      id: "demo-farmer-001",
      name: "John Ssekandi",
      rating: 4.7,
      isVerified: true,
      location: { lat: 0.3476, lng: 32.5825, district: "Kampala" },
    },
    crop: "Maize",
    variety: "LONGE 5H",
    quantity: 500,
    unit: "kg",
    price: 1200,
    pricePer: "kg",
    quality: "A",
    harvestDate: "2024-05-10T00:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1601593346740-925612772716?w=400",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    ],
    description:
      "Premium grade LONGE 5H maize, freshly harvested. Dried to 13% moisture. Ideal for milling and animal feed. Available for immediate pickup or delivery within Kampala.",
    location: { lat: 0.3476, lng: 32.5825, district: "Kampala", state: "Central Region" },
    isAvailable: true,
    createdAt: "2024-05-12T08:00:00.000Z",
    views: 142,
  },
  {
    id: "listing-002",
    farmerId: "farmer-002",
    farmer: {
      id: "farmer-002",
      name: "Grace Auma",
      rating: 4.5,
      isVerified: true,
      location: { lat: 0.4478, lng: 33.2026, district: "Jinja" },
    },
    crop: "Beans",
    variety: "K132 Red Kidney",
    quantity: 300,
    unit: "kg",
    price: 3500,
    pricePer: "kg",
    quality: "A",
    harvestDate: "2024-05-08T00:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400",
    ],
    description:
      "High-quality K132 red kidney beans. Clean, sorted, and bagged in 50kg sacks. Excellent for export and local markets.",
    location: { lat: 0.4478, lng: 33.2026, district: "Jinja", state: "Eastern Region" },
    isAvailable: true,
    createdAt: "2024-05-11T10:30:00.000Z",
    views: 89,
  },
  {
    id: "listing-003",
    farmerId: "farmer-003",
    farmer: {
      id: "farmer-003",
      name: "Moses Okello",
      rating: 4.3,
      isVerified: false,
      location: { lat: 2.7748, lng: 32.2990, district: "Gulu" },
    },
    crop: "Sorghum",
    variety: "SESO 3",
    quantity: 800,
    unit: "kg",
    price: 900,
    pricePer: "kg",
    quality: "B",
    harvestDate: "2024-04-28T00:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    ],
    description:
      "SESO 3 sorghum variety, good for brewing and animal feed. Bulk quantities available. Negotiable price for large orders.",
    location: { lat: 2.7748, lng: 32.2990, district: "Gulu", state: "Northern Region" },
    isAvailable: true,
    createdAt: "2024-05-09T14:00:00.000Z",
    views: 56,
  },
  {
    id: "listing-004",
    farmerId: "farmer-004",
    farmer: {
      id: "farmer-004",
      name: "Fatuma Nabirye",
      rating: 4.8,
      isVerified: true,
      location: { lat: 0.6167, lng: 30.6500, district: "Mbarara" },
    },
    crop: "Tomatoes",
    variety: "Tengeru 97",
    quantity: 200,
    unit: "crates",
    price: 45000,
    pricePer: "crate",
    quality: "A",
    harvestDate: "2024-05-14T00:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400",
    ],
    description:
      "Fresh Tengeru 97 tomatoes, firm and ripe. Harvested this week. Perfect for supermarkets and restaurants. Delivery available.",
    location: { lat: 0.6167, lng: 30.6500, district: "Mbarara", state: "Western Region" },
    isAvailable: true,
    createdAt: "2024-05-14T06:00:00.000Z",
    views: 203,
  },
  {
    id: "listing-005",
    farmerId: "farmer-005",
    farmer: {
      id: "farmer-005",
      name: "Robert Tumwine",
      rating: 4.1,
      isVerified: true,
      location: { lat: 0.5167, lng: 30.2667, district: "Kasese" },
    },
    crop: "Cassava",
    variety: "NASE 14",
    quantity: 2000,
    unit: "kg",
    price: 600,
    pricePer: "kg",
    quality: "A",
    harvestDate: "2024-05-05T00:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
    ],
    description:
      "NASE 14 cassava, high starch content. Suitable for flour processing and starch factories. Large quantities available.",
    location: { lat: 0.5167, lng: 30.2667, district: "Kasese", state: "Western Region" },
    isAvailable: true,
    createdAt: "2024-05-07T09:00:00.000Z",
    views: 77,
  },
  {
    id: "listing-006",
    farmerId: "farmer-006",
    farmer: {
      id: "farmer-006",
      name: "Agnes Atim",
      rating: 4.6,
      isVerified: true,
      location: { lat: 1.7167, lng: 32.0000, district: "Lira" },
    },
    crop: "Sunflower",
    variety: "Record",
    quantity: 600,
    unit: "kg",
    price: 2200,
    pricePer: "kg",
    quality: "A",
    harvestDate: "2024-05-01T00:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400",
    ],
    description:
      "Record variety sunflower seeds, high oil content (42%). Ideal for oil mills. Properly dried and cleaned.",
    location: { lat: 1.7167, lng: 32.0000, district: "Lira", state: "Northern Region" },
    isAvailable: true,
    createdAt: "2024-05-03T11:00:00.000Z",
    views: 118,
  },
  {
    id: "listing-007",
    farmerId: "farmer-007",
    farmer: {
      id: "farmer-007",
      name: "David Waiswa",
      rating: 4.4,
      isVerified: false,
      location: { lat: 0.9500, lng: 33.4667, district: "Mbale" },
    },
    crop: "Groundnuts",
    variety: "Serenut 4T",
    quantity: 400,
    unit: "kg",
    price: 4500,
    pricePer: "kg",
    quality: "A",
    harvestDate: "2024-04-25T00:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400",
    ],
    description:
      "Serenut 4T groundnuts, shelled and sorted. High protein content. Good for confectionery and oil extraction.",
    location: { lat: 0.9500, lng: 33.4667, district: "Mbale", state: "Eastern Region" },
    isAvailable: true,
    createdAt: "2024-04-27T08:30:00.000Z",
    views: 94,
  },
  {
    id: "listing-008",
    farmerId: "farmer-008",
    farmer: {
      id: "farmer-008",
      name: "Prossy Namukasa",
      rating: 4.9,
      isVerified: true,
      location: { lat: 0.3988, lng: 32.4432, district: "Wakiso" },
    },
    crop: "Bananas",
    variety: "Matooke (FHIA-17)",
    quantity: 150,
    unit: "bunches",
    price: 12000,
    pricePer: "bunch",
    quality: "A",
    harvestDate: "2024-05-13T00:00:00.000Z",
    images: [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
    ],
    description:
      "Fresh FHIA-17 matooke bananas, ready for cooking. Harvested from well-maintained plantation. Delivery to Kampala available.",
    location: { lat: 0.3988, lng: 32.4432, district: "Wakiso", state: "Central Region" },
    isAvailable: true,
    createdAt: "2024-05-13T07:00:00.000Z",
    views: 167,
  },
];

// ─── MOCK CONVERSATIONS ───────────────────────────────────────────────────────

export const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv-001",
    participants: [
      {
        id: "demo-farmer-001",
        name: "John Ssekandi",
        role: "farmer",
        isOnline: true,
      },
      {
        id: "demo-buyer-001",
        name: "Sarah Nakato",
        role: "buyer",
        isOnline: false,
      },
    ],
    lastMessage: {
      text: "Can you deliver 200kg to Kampala by Friday?",
      timestamp: "2024-05-14T14:30:00.000Z",
      senderId: "demo-buyer-001",
    },
    unreadCount: 2,
    listingId: "listing-001",
    listing: { crop: "Maize", quantity: "200 kg", price: "UGX 1,200/kg" },
    updatedAt: "2024-05-14T14:30:00.000Z",
  },
  {
    id: "conv-002",
    participants: [
      {
        id: "demo-farmer-001",
        name: "John Ssekandi",
        role: "farmer",
        isOnline: true,
      },
      {
        id: "buyer-002",
        name: "Peter Mugisha",
        role: "buyer",
        isOnline: true,
      },
    ],
    lastMessage: {
      text: "Price is negotiable for bulk orders above 1 tonne.",
      timestamp: "2024-05-14T11:00:00.000Z",
      senderId: "demo-farmer-001",
    },
    unreadCount: 0,
    listingId: "listing-001",
    listing: { crop: "Maize", quantity: "500 kg", price: "UGX 1,200/kg" },
    updatedAt: "2024-05-14T11:00:00.000Z",
  },
  {
    id: "conv-003",
    participants: [
      {
        id: "demo-buyer-001",
        name: "Sarah Nakato",
        role: "buyer",
        isOnline: false,
      },
      {
        id: "farmer-004",
        name: "Fatuma Nabirye",
        role: "farmer",
        isOnline: false,
      },
    ],
    lastMessage: {
      text: "I'll reserve 50 crates for you. Please confirm by tomorrow.",
      timestamp: "2024-05-13T16:45:00.000Z",
      senderId: "farmer-004",
    },
    unreadCount: 1,
    listingId: "listing-004",
    listing: { crop: "Tomatoes", quantity: "50 crates", price: "UGX 45,000/crate" },
    updatedAt: "2024-05-13T16:45:00.000Z",
  },
];

// ─── MOCK MESSAGES ────────────────────────────────────────────────────────────

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-001": [
    {
      id: "msg-001",
      conversationId: "conv-001",
      senderId: "demo-buyer-001",
      text: "Hello! I saw your maize listing. Is it still available?",
      timestamp: "2024-05-14T13:00:00.000Z",
      status: "read",
    },
    {
      id: "msg-002",
      conversationId: "conv-001",
      senderId: "demo-farmer-001",
      text: "Yes, still available! 500kg of LONGE 5H, quality grade A.",
      timestamp: "2024-05-14T13:05:00.000Z",
      status: "read",
    },
    {
      id: "msg-003",
      conversationId: "conv-001",
      senderId: "demo-buyer-001",
      text: "Great! What's the best price for 200kg?",
      timestamp: "2024-05-14T13:10:00.000Z",
      status: "read",
    },
    {
      id: "msg-004",
      conversationId: "conv-001",
      senderId: "demo-farmer-001",
      text: "For 200kg I can do UGX 1,100/kg. That's a 100 discount from the listed price.",
      timestamp: "2024-05-14T13:20:00.000Z",
      status: "read",
    },
    {
      id: "msg-005",
      conversationId: "conv-001",
      senderId: "demo-buyer-001",
      text: "Can you deliver 200kg to Kampala by Friday?",
      timestamp: "2024-05-14T14:30:00.000Z",
      status: "delivered",
    },
  ],
  "conv-002": [
    {
      id: "msg-006",
      conversationId: "conv-002",
      senderId: "buyer-002",
      text: "Hi, I need 1 tonne of maize. What's your bulk price?",
      timestamp: "2024-05-14T10:30:00.000Z",
      status: "read",
    },
    {
      id: "msg-007",
      conversationId: "conv-002",
      senderId: "demo-farmer-001",
      text: "Price is negotiable for bulk orders above 1 tonne.",
      timestamp: "2024-05-14T11:00:00.000Z",
      status: "read",
    },
  ],
  "conv-003": [
    {
      id: "msg-008",
      conversationId: "conv-003",
      senderId: "demo-buyer-001",
      text: "Are your tomatoes still fresh? I need 50 crates for my restaurant.",
      timestamp: "2024-05-13T15:00:00.000Z",
      status: "read",
    },
    {
      id: "msg-009",
      conversationId: "conv-003",
      senderId: "farmer-004",
      text: "Yes! Harvested just yesterday. Very firm and ripe.",
      timestamp: "2024-05-13T15:30:00.000Z",
      status: "read",
    },
    {
      id: "msg-010",
      conversationId: "conv-003",
      senderId: "farmer-004",
      text: "I'll reserve 50 crates for you. Please confirm by tomorrow.",
      timestamp: "2024-05-13T16:45:00.000Z",
      status: "delivered",
    },
  ],
};

// ─── MOCK WEATHER ─────────────────────────────────────────────────────────────

export const MOCK_WEATHER: WeatherData = {
  location: "Kampala, Uganda",
  latitude: 0.3476,
  longitude: 32.5825,
  current: {
    temp: 26,
    feelsLike: 28,
    humidity: 72,
    windSpeed: 12,
    windDir: "SW",
    condition: "Partly Cloudy",
    icon: "⛅",
    weatherCode: 2,
  },
  hourly: [
    { time: "09:00", temp: 24, condition: "Sunny", icon: "☀️", precipitation: 0, weatherCode: 0 },
    { time: "12:00", temp: 28, condition: "Partly Cloudy", icon: "⛅", precipitation: 5, weatherCode: 2 },
    { time: "15:00", temp: 27, condition: "Light Rain", icon: "🌦️", precipitation: 40, weatherCode: 61 },
    { time: "18:00", temp: 23, condition: "Cloudy", icon: "☁️", precipitation: 20, weatherCode: 3 },
    { time: "21:00", temp: 21, condition: "Clear", icon: "🌙", precipitation: 0, weatherCode: 0 },
  ],
  daily: [
    { date: "2024-05-14", dayName: "Today", tempMax: 29, tempMin: 19, condition: "Partly Cloudy", icon: "⛅", precipitation: 30, weatherCode: 2 },
    { date: "2024-05-15", dayName: "Tomorrow", tempMax: 27, tempMin: 18, condition: "Light Rain", icon: "🌦️", precipitation: 60, weatherCode: 61 },
    { date: "2024-05-16", dayName: "Thursday", tempMax: 30, tempMin: 20, condition: "Sunny", icon: "☀️", precipitation: 5, weatherCode: 0 },
    { date: "2024-05-17", dayName: "Friday", tempMax: 28, tempMin: 19, condition: "Partly Cloudy", icon: "⛅", precipitation: 20, weatherCode: 2 },
    { date: "2024-05-18", dayName: "Saturday", tempMax: 25, tempMin: 17, condition: "Thunderstorm", icon: "⛈️", precipitation: 80, weatherCode: 95 },
    { date: "2024-05-19", dayName: "Sunday", tempMax: 29, tempMin: 20, condition: "Sunny", icon: "☀️", precipitation: 5, weatherCode: 0 },
    { date: "2024-05-20", dayName: "Monday", tempMax: 31, tempMin: 21, condition: "Hot & Sunny", icon: "🌤️", precipitation: 0, weatherCode: 1 },
  ],
  alerts: [
    {
      id: "alert-001",
      type: "warning",
      title: "Heavy Rain Expected",
      message: "Heavy rainfall expected Saturday. Harvest and store crops before Friday evening.",
    },
    {
      id: "alert-002",
      type: "info",
      title: "Good Planting Conditions",
      message: "Soil moisture levels are optimal this week. Good time to plant maize and beans.",
    },
  ],
};

// ─── TRENDING CROPS ───────────────────────────────────────────────────────────

export const MOCK_TRENDING_CROPS = [
  { crop: "Maize", count: 48 },
  { crop: "Beans", count: 35 },
  { crop: "Tomatoes", count: 29 },
  { crop: "Cassava", count: 22 },
  { crop: "Groundnuts", count: 18 },
  { crop: "Sorghum", count: 14 },
];

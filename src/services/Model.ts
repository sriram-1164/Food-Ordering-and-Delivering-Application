export interface FoodDetails {
  foodId: number;
  foodname: string;
  price: number;
  mealtype: string;
  foodtype: string;
}


export interface AddFoodDetails {
  foodId: number;
  foodname: string;
  price: number;
  mealtype: string;
  foodtype: string;
}

export interface OrderDetails {
  id: string;
  userId: string;
  username: string;

  foodId: string;
  foodname: string;

  price: number;
  mealtype: string;
  foodtype: string;
  address: Address;
  quantity: number;
  date: string;

  status: "Preparing" | "Delivered" | "Cancelled" | "OutforDelivery" | "Reached";
  phonenumber: string;

  feedbackGiven?: boolean;
  deliveryPartnerId?: number;
  deliveryOtp?: number;
  otpExpiry?: number;

  routeHistory?: {
  lat: number;
  lng: number;
  timestamp: number;
}[];

// 🔥 NEW FIELDS FOR TIME TRACKING
  startTime?: string; // Captured when status moves to "OutforDelivery"
  endTime?: string;   // Captured when status moves to "Delivered"

}

export interface UserDetails {
  id: number;
  phonenumber: string;
  profileImage: any;
  userId: number;
  username: string;
  password: string;

  role: "user" | "admin" | "delivery";
  isOnline?: boolean;
  isBusy?: boolean;

  addresses?: Address[];
  email?: string;

  currentLocation?: {
    lat: number;
    lng: number;
  };

}
export interface Address {
  id: number;
  label: string;
  addressLine: string;
  city: string;
  pincode: string;
  lat?: number;   // 🔥 ADD
  lng?: number;
}

export interface AddUserDetails {
  id: number;
  userId: number;
  username: string;
  password: string;
  role: "user";
  phonenumber: string;
  profileImage?: string;
}

export interface AddFeedback {
  orderId: string;
  userId: string;
  foodId: string;
  feedback: string;
  rating: number;
  createdAt: string;
  username: string;
  foodname: string;
  imageUrl?: string;
}

export interface FoodSalesReport {
  foodname: string;
  price: number;
  totalOrders: number;
  totalQuantity: number;
  totalRevenue: number;
}
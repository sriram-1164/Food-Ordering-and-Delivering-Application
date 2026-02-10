export interface FoodDetails {
  id: string;
  foodname: string;
  price: number;
  mealtype: string;
  foodtype: string;
}


export interface AddFoodDetails {
  foodname: string;
  price: number;
  mealtype: string;
  foodtype: string;
}

export interface OrderDetails {
  id: string;
  userId: string;
  username: string;

  foodId: string;          // ✅ NEW
  foodname: string;

  price: number;
  mealtype: string;
  foodtype: string;
  address: string;
  quantity: number;
  date: string;

  status: "Preparing" | "Delivered" | "Cancelled";
  phonenumber: string;

  feedbackGiven?: boolean; // ✅ NEW (from backend)
}




export interface UserDetails {
  id: number;              
  phonenumber: string;
  profileImage: any;
  userId: number;
  username: string;
  password: string;
  role: "user" | "admin";
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
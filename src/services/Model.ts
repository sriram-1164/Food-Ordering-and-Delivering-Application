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

  foodId: string;          
  foodname: string;

  price: number;
  mealtype: string;
  foodtype: string;
  address: Address;
  quantity: number;
  date: string;

  status: "Preparing" | "Delivered" | "Cancelled";
  phonenumber: string;

  feedbackGiven?: boolean; 
}




export interface UserDetails {
  id: number;              
  phonenumber: string;
  profileImage: any;
  userId: number;
  username: string;
  password: string;
  role: "user" | "admin";
  addresses?: Address[];
  email?: string;
}
export interface Address {
  id: number;
  label: string;        
  addressLine: string;
  city: string;
  pincode: string;
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
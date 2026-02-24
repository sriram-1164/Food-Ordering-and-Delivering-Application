import axios, { AxiosRequestConfig } from "axios";
import { useAxios } from "./Axios";
import { FoodDetails, AddFoodDetails, OrderDetails, UserDetails, AddUserDetails, } from "../services/Model";

interface ICrudService {
  getUsers: () => Promise<UserDetails[]>;

  addUser: (userInformation: AddUserDetails) => Promise<AddUserDetails>;

  getFoods: () => Promise<FoodDetails[]>;

  addFoods: (foodInformation: AddFoodDetails, photoFile?: File) => Promise<AddFoodDetails>;

  updateFood: (foodId: number, foodInformation: AddFoodDetails, photoFile?: File) => Promise<FoodDetails>;

  deleteFood: (foodId: number) => Promise<void>;

  getOrders: () => Promise<OrderDetails[]>

  addOrder: (orderInformation: OrderDetails) => Promise<OrderDetails>;

  updateOrder: (
    id: string,
    data: Partial<OrderDetails> & {
      newRoutePoint?: {
        lat: number;
        lng: number;
        timestamp: number;
      };
    }
  ) => Promise<OrderDetails>;

  deleteOrder: (id: number) => Promise<void>

  addFeedback: (feedbackData: FormData) => Promise<any>;

  getFeedbacksFromNode: () => Promise<any>;

  updateUser: (id: number, userInformation: Partial<UserDetails>) => Promise<UserDetails>;

  uploadProfileImage: (data: FormData) => Promise<any>;
}

export function CrudService(): ICrudService {
  const axiosService = useAxios(
    axios.create({
      baseURL: "http://localhost:3001",
      headers: { "Content-Type": "application/json" }
    })
  );

  const uploadAxios = axios.create({
    baseURL: "http://localhost:3001", // 👈 Node server
  });

  // getting user details
  const getUsers = () => {
    const config: AxiosRequestConfig = {
      method: "get",
      url: "/users"
    };
    return axiosService.makeRequest<UserDetails[]>(config);
  };

  // adding user details
  const addUser = (userInformation: AddUserDetails) => {
    const config: AxiosRequestConfig = {
      method: "post",
      url: "/users",
      data: userInformation
    };
    return axiosService.makeRequest<AddUserDetails>(config);
  };
  // getting food details
  const getFoods = () => {
    const config: AxiosRequestConfig = {
      method: "get",
      url: "/foods"
    };
    return axiosService.makeRequest<FoodDetails[]>(config);
  };
  // add food 
// ────────────────────────────────────────────────
// addFoods
const addFoods = (foodInformation: AddFoodDetails, photoFile?: File) => {
  const formData = new FormData();
  formData.append("foodname", foodInformation.foodname);
  formData.append("price", foodInformation.price.toString());
  formData.append("foodtype", foodInformation.foodtype);

  // ──── IMPORTANT ────
  formData.append("mealtypes", JSON.stringify(foodInformation.mealtypes || []));

  if (foodInformation.foodId) {
    formData.append("foodId", foodInformation.foodId.toString());
  }
  if (photoFile) {
    formData.append("photo", photoFile);
  }
  const config: AxiosRequestConfig = {
    method: "post",
    url: "/foods",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  };
  return axiosService.makeRequest<FoodDetails>(config);
};

// ────────────────────────────────────────────────
// updateFood
const updateFood = (foodId: number, foodInformation: AddFoodDetails, photoFile?: File) => {
  const formData = new FormData();
  formData.append("foodname", foodInformation.foodname);
  formData.append("price", foodInformation.price.toString());
  formData.append("foodtype", foodInformation.foodtype);

  // ──── IMPORTANT ────
  formData.append("mealtypes", JSON.stringify(foodInformation.mealtypes || []));

  if (photoFile) {
    formData.append("photo", photoFile);
  }

  const config: AxiosRequestConfig = {
    method: "patch",
    url: `/foods/${foodId}`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  };
  return axiosService.makeRequest<FoodDetails>(config);
};
  //delete food
  const deleteFood = async (foodId: any) => {
    const config: AxiosRequestConfig = {
      method: "delete",
      url: `/foods/${foodId}`
    };
    await axiosService.makeRequest(config);
  };
  // getting orders
  const getOrders = () => {
    const config: AxiosRequestConfig = {
      method: "get",
      url: "/orders"
    };
    return axiosService.makeRequest<OrderDetails[]>(config);
  };
  // adding order
  const addOrder = (orderInformation: OrderDetails) => {
    const config: AxiosRequestConfig = {
      method: "post",
      url: "/orders",
      data: orderInformation
    };
    return axiosService.makeRequest<OrderDetails>(config);
  };
  // updating order by pending or delivered
  const updateOrder = (
    id: string,
    data: Partial<OrderDetails> & {
      newRoutePoint?: {
        lat: number;
        lng: number;
        timestamp: number;
      };
    }
  ) => {
    const config: AxiosRequestConfig = {
      method: "patch",
      url: `/orders/${id}`,
      data
    };
    console.log("CONFIG URL BEFORE REQUEST:", config.url);
    return axiosService.makeRequest<OrderDetails>(config);
  };
  // deleting the order
  const deleteOrder = async (id: number) => {
    const config: AxiosRequestConfig = {
      method: "delete",
      url: `/orders/${id}`
    };
    await axiosService.makeRequest(config);
  };
  const addFeedback = (feedbackData: FormData) => {
    return uploadAxios.post("/feedbacks", feedbackData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const getFeedbacksFromNode = () => {
    return uploadAxios.get("/feedbacks");
  };

  const uploadProfileImage = (formData: FormData) => {
    return uploadAxios.post("/api/profile-pic", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const updateUser = (id: number, data: Partial<UserDetails>) => {
    const config: AxiosRequestConfig = {
      method: "patch",
      url: `/users/${id}`,
      data,
    };
    console.log("CONFIG URL BEFORE REQUEST:", config.url);
    return axiosService.makeRequest<UserDetails>(config);
  };

  return {
    getUsers,
    addUser,
    getFoods,
    addFoods,
    getOrders,
    updateFood,
    deleteFood,
    updateOrder,
    deleteOrder,
    addOrder,
    addFeedback,
    getFeedbacksFromNode,
    updateUser,
    uploadProfileImage,
  };
}
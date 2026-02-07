import axios, { AxiosRequestConfig } from "axios";
import { useAxios } from "./Axios";
import { FoodDetails, AddFoodDetails, OrderDetails, UserDetails, AddUserDetails, AddFeedback } from "../services/Model";

interface ICrudService {
  getUsers: () => Promise<UserDetails[]>;

  addUser: (userInformation: AddUserDetails) => Promise<AddUserDetails>;

  getFoods: () => Promise<FoodDetails[]>;

  addFoods: (foodInformation: AddFoodDetails) => Promise<AddFoodDetails>;


  updateFood: (id: string, foodInformation: AddFoodDetails) => Promise<FoodDetails>;


  deleteFood: (id: string) => Promise<void>;

  getOrders: () => Promise<OrderDetails[]>

  addOrder: (orderInformation: OrderDetails) => Promise<OrderDetails>;


  updateOrder: (
    id: string,
    orderInformation: Partial<OrderDetails>
  ) => Promise<OrderDetails>;


  deleteOrder: (id: number) => Promise<void>

  addFeedback: (feedbackData: AddFeedback) => Promise<AddFeedback>
  getFeedback: () => Promise<AddFeedback[]>

}

export function CrudService(): ICrudService {
  const axiosService = useAxios(
    axios.create({
      baseURL: "http://192.168.0.83:3001",
      headers: { "Content-Type": "application/json" }
    })
  );
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

  const addFoods = (foodInformation: AddFoodDetails) => {
    const config: AxiosRequestConfig = {
      method: "post",
      url: "/foods",
      data: foodInformation
    };
    return axiosService.makeRequest<AddFoodDetails>(config);
  };

  //update food details

  const updateFood = (id: string, foodInformation: AddFoodDetails) => {
    const config: AxiosRequestConfig = {
      method: "patch",
      url: `/foods/${id}`,
      data: foodInformation
    };
    return axiosService.makeRequest<FoodDetails>(config);
  };

  //delete food
  const deleteFood = async (id: string) => {
    const config: AxiosRequestConfig = {
      method: "delete",
      url: `/foods/${id}`
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
  const updateOrder = (id: string, status: Partial<OrderDetails>) => {
    const config: AxiosRequestConfig = {
      method: "patch",
      url: `/orders/${id}`,
      data: status
    };
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
  const addFeedback = (feedbackData: AddFeedback) => {
    const config: AxiosRequestConfig = {
      method: "post",
      url: "/feedbacks",
      data: feedbackData,
    };

    return axiosService.makeRequest<AddFeedback>(config);
  };

  const getFeedback = () => {
    const config: AxiosRequestConfig = {
      method: "get",
      url: "/feedbacks",
    };

    return axiosService.makeRequest<AddFeedback[]>(config);
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
    getFeedback
    

  };
}
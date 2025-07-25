import axios from "axios";
const BASE_URL =  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api"
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // This allows cookies to be sent with requests
});

export {axiosInstance};
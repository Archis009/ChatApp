import axios from "axios"; 
// axios replaces fetching API

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials: true,
})
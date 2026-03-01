import axios from "axios"; 
// axios replaces fetching API

export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials: true,
})
import axios from "axios"; 
// axios replaces fetching API

export const axiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true,
})
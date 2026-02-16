import axios from "axios"; 
// axios replaces fetching API

export const axiosInstance = axios.create({
    baseURL: import.meta.env.NODE === "development" ? "http://localhost:3000/api" : "/api",
    withCredentials: true,
})
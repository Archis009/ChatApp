import {create} from "zustand"; 

export const useAuthStore = create((set) => ({
    authUser: {name: "john", id: "123"},
    isloading: false, 
    isloggedIn: false,

    login: () => {
        console.log("Hey there")
        set({ isloggedIn: true, isloading: true});
    }
}))
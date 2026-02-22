import axios from "axios";
import { removeUser } from "../Slices/UserSlice";

const base_url = "http://localhost:8080/auth/";

const loginUser = async (login: any) => {
    try {
        const response = await axios.post(`${base_url}login`, login);
        return response.data;
    } catch (error: any) {
        console.error(error.response);
        throw error;  // Ensures the calling function's .catch() executes
    }
};

const navigatetoLogin = (navigate:any) => {
    localStorage.removeItem("token");
    removeUser()
    navigate("/login");
}

export {loginUser, navigatetoLogin};
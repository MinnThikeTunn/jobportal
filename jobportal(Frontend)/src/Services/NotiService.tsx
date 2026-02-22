import axios from "axios";
import axiosInstance from "../Inteceptor/AxiosInterceptor";

const base_url = "http://localhost:8080/notification/";

const getNotifications = async (id:any) => {
    return axiosInstance.get(`/notification/get/${id}`)
        .then(res => res.data)
        .catch(error => {throw error})
}

const readNotification = async (id:any) => {
    return axiosInstance.put(`/notification/read/${id}`)
        .then(res => res.data)
        .catch(error => {throw error})
}

export { getNotifications, readNotification };
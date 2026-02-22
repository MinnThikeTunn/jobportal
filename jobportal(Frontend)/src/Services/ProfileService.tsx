import axios from "axios";
import axiosInstance from "../Inteceptor/AxiosInterceptor";

const base_url = "http://localhost:8080/profiles/";

const getProfile = async (id: any) => {
    return axiosInstance.get(`/profiles/get/${id}`)
        .then(res => res.data)
        .catch(error => { throw error })
}

const updateProfile = async (profile: any) => {
    return axiosInstance.post(`/profiles/update`, profile)
        .then(res => {console.log(res.data)})
        .catch(error => { throw error })
}

const getAllProfiles = async () => {
    return axiosInstance.get(`/profiles/getAll`)
        .then(res => res.data)
        .catch(error => { throw error })
}

const getFilteredProfiles = async (filter:any) => {
    return axiosInstance.post(`/profiles/filter`, filter)
        .then(res => res.data)
        .catch(err => {throw err});
}

export { getProfile, updateProfile, getAllProfiles, getFilteredProfiles };
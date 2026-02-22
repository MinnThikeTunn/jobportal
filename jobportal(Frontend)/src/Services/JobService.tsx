import axios from "axios";
import axiosInstance from "../Inteceptor/AxiosInterceptor";

const base_url = "http://localhost:8080/jobs/";

const postJob = async (job:any) => {
    return axiosInstance.post(`/jobs/post`, job)
        .then(res => res.data)
        .catch(err => {throw err});
}

const getAllJobs = async () => {
    return axiosInstance.get(`/jobs/getAll`)
        .then(res => res.data)
        .catch(err => {throw err});
}

const getJob = async (id:any) => {
    return axiosInstance.get(`/jobs/get/${id}`)
        .then(res => res.data)
        .catch(err => {throw err});
}

const applyJob = async (jobId:any, applicant:any) => {
    return axiosInstance.post(`/jobs/apply/${jobId}`, applicant)
        .then(res => res.data)
        .catch(err => {throw err});
}

const getJobPostedBy = async (id:any) => {
    return axiosInstance.get(`/jobs/postedBy/${id}`)
        .then(res => res.data)
        .catch(err => {throw err});
}

const changeAppStatus = async (application:any) => {
    return axiosInstance.post(`/jobs/changeAppStatus`, application)
        .then(res => res.data)
        .catch(err => {throw err});
}

const getFilteredJobs = async (filter:any) => {
    return axiosInstance.post(`/jobs/filter`, filter)
        .then(res => res.data)
        .catch(err => {throw err});
}

const getRecommendedJobs = async (job:any) => {
    return axiosInstance.post(`/jobs/getRecommendedJobs`, job, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.data)
        .catch(err => {throw err});
}



export { postJob, getAllJobs, getJob, applyJob, getJobPostedBy, changeAppStatus, getFilteredJobs, getRecommendedJobs };
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://taskstake.onrender.com/api',
    withCredentials: true
});
import axios from 'axios'

const axiosPublic = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api', // local
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
})

export default axiosPublic
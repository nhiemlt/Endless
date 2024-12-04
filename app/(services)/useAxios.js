import { useSelector } from 'react-redux';
import axios from 'axios';
import { domain } from '../../constants/Domain'; // Đảm bảo bạn import đúng từ Domain.js

const useAxios = () => {
  // Lấy token từ Redux store
  const token = useSelector((state) => state.auth.token);

  // Tạo axios instance
  const axiosInstance = axios.create({
    baseURL: domain,  // Đảm bảo sử dụng URL đầy đủ (ví dụ: http://192.168.8.113:8080)
    timeout: 10000,    // Timeout 10 giây
    headers: {
      'Content-Type': 'application/json', // Đảm bảo định dạng JSON cho các yêu cầu
    },
  });

  // Interceptor để thêm token vào headers của mỗi yêu cầu
  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Adding token to request headers:', config.headers['Authorization']);
      } else {
        console.log('No token found, proceeding without Authorization header.');
      }
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor để xử lý phản hồi từ server
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      return response;
    },
    (error) => {
      console.error('Response error:', error);
      if (error.response) {
        console.log('Response error data:', error.response.data);
        console.log('Response status:', error.response.status);
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Response error message:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;

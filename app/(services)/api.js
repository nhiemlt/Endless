// app/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import domain from '../../constants/Domain'; // Đảm bảo bạn có tệp constants/Domain.ts chứa các thông số API URL

// Tạo instance axios với cấu hình cơ bản
const api = axios.create({
  baseURL: domain, // Đặt URL cơ bản cho API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm lấy token từ AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error fetching token', error);
    return null;
  }
};

// Cấu hình lại header Authorization với Bearer Token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý khi token hết hạn (HTTP 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Token expired or invalid');
      // Điều hướng đến trang login (sử dụng react-navigation hoặc router)
    }
    return Promise.reject(error);
  }
);

export default api;

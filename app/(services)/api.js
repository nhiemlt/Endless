import axios from "axios";
import domain from "../../constants/Domain";
// Cấu hình axios mặc định
const api = axios.create({
  baseURL: domain, // Thay thế bằng URL của API
});

// Thêm Bearer token vào header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Lấy token từ Redux hoặc Storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

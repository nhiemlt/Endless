// profileService.js
import useAxios from '../useAxios'; // Đảm bảo đường dẫn đúng

const ProfileService = () => {
  const axiosInstance = useAxios();

  const fetchCurrentUser = async () => {
    try {
      const response = await axiosInstance.get(`/api/users/current`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);

      if (error.response) {
        // Nếu có response từ server
        console.log('Response error data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        // Nếu có request nhưng không nhận được response
        console.log('No response received:', error.request);
      } else {
        // Nếu lỗi xảy ra trong quá trình thiết lập request
        console.log('Request setup error:', error.message);
      }
      
      throw new Error('Không thể lấy thông tin người dùng');
    }
  };

  const updateCurrentUser = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`/api/users/current`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);

      if (error.response) {
        // Nếu có response từ server
        console.log('Response error data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        // Nếu có request nhưng không nhận được response
        console.log('No response received:', error.request);
      } else {
        // Nếu lỗi xảy ra trong quá trình thiết lập request
        console.log('Request setup error:', error.message);
      }

      throw new Error('Đã xảy ra lỗi khi cập nhật người dùng');
    }
  };

  return { fetchCurrentUser, updateCurrentUser };
};

export default ProfileService;

import useAxios from '../useAxios'; // Đảm bảo đường dẫn đúng

const UserAddressService = () => {
  const axiosInstance = useAxios(); // Sử dụng custom hook useAxios để có instance axios

  const fetchUserAddresses = async () => {
    try {
      const response = await axiosInstance.get('/api/useraddresses/current');
      return response.data; // Trả về danh sách địa chỉ
    } catch (error) {
      console.error('Error fetching user addresses:', error);

      if (error.response) {
        // Nếu có phản hồi từ server
        console.log('Response error data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        throw new Error(error.response.data.message || 'Không thể tải danh sách địa chỉ.');
      } else if (error.request) {
        // Nếu có request nhưng không nhận được phản hồi
        console.log('No response received:', error.request);
        throw new Error('Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.');
      } else {
        // Nếu lỗi xảy ra trong quá trình thiết lập request
        console.log('Request setup error:', error.message);
        throw new Error('Đã xảy ra lỗi không mong muốn: ' + error.message);
      }
    }
  };

  const addUserAddressCurrent = async (addressData) => {
    try {
      const response = await axiosInstance.post('/api/useraddresses/add-current', addressData);
      return response.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
      console.error('Error adding user address:', error);
      if (error.response) {
        console.log('LỖI NÀY LÀ:', error)
        console.log('Response error data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        Alert.alert('Lỗi', error.response.data.message || 'Không thể thêm địa chỉ.');
        throw new Error(error.response.data.message || 'Không thể thêm địa chỉ.');
      } else if (error.request) {
        console.log('No response received:', error.request);
        Alert.alert('Lỗi', 'Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.');
        throw new Error('Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.');
      } else {
        console.log('Request setup error:', error.message);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi không mong muốn: ' + error.message);
        throw new Error('Đã xảy ra lỗi không mong muốn: ' + error.message);
      }
    }
  };
  

  const deleteUserAddressCurrent = async (addressId) => {
    try {
      await axiosInstance.delete(`/api/useraddresses/current/${addressId}`);
      return { message: 'Địa chỉ đã được xóa thành công' }; // Trả về thông báo thành công
    } catch (error) {
      console.error('Error deleting user address:', error);

      if (error.response) {
        console.log('Response error data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        throw new Error(error.response.data.message || 'Không thể xóa địa chỉ.');
      } else if (error.request) {
        console.log('No response received:', error.request);
        throw new Error('Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.');
      } else {
        console.log('Request setup error:', error.message);
        throw new Error('Đã xảy ra lỗi không mong muốn: ' + error.message);
      }
    }
  };

  return { fetchUserAddresses, addUserAddressCurrent, deleteUserAddressCurrent };
};

export default UserAddressService;

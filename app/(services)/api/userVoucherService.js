import useAxios from '../useAxios'; // Đảm bảo đường dẫn đúng

// Hàm xử lý lỗi
const handleError = (error) => {
  if (error.response) {
    // Nếu có phản hồi từ server
    console.error('Server error:', error.response.data);
    throw new Error(error.response.data.message || error.response.data);
  } else if (error.request) {
    // Nếu không có phản hồi từ server
    console.error('No response from server:', error.request);
    throw new Error('No response from server. Please try again.');
  } else {
    // Các lỗi khác
    console.error('Error:', error.message);
    throw new Error('An unexpected error occurred: ' + error.message);
  }
};

const UserVoucherService = () => {
  const axiosInstance = useAxios(); // Sử dụng custom hook useAxios để có instance axios

  // Lấy danh sách voucher của người dùng
  const getUserVouchers = async () => {
    try {
      const response = await axiosInstance.get('/api/user-vouchers');
      return response.data; // Trả về danh sách voucher của người dùng
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return { message: "User chưa đăng nhập." }; // Trả về thông báo nếu người dùng chưa đăng nhập
      } else if (error.response && error.response.status === 204) {
        return { message: "Không có voucher còn hạn sử dụng." }; // Trả về thông báo nếu không có voucher còn hạn
      } else {
        handleError(error); // Xử lý lỗi với hàm riêng
      }
    }
  };

  // Lấy thông tin voucher theo ID
  const getVoucherById = async (voucherId) => {
    try {
      const response = await axiosInstance.get(`/api/user-vouchers/${voucherId}`);
      return response.data; // Trả về thông tin voucher theo ID
    } catch (error) {
      handleError(error); // Xử lý lỗi với hàm riêng
    }
  };

  // Sử dụng voucher cho đơn hàng
  const useVoucher = async (voucherId, orderId) => {
    try {
      const response = await axiosInstance.post(`/api/user-vouchers/${voucherId}/use`, { orderId });
      return response.data; // Trả về thông tin sử dụng voucher
    } catch (error) {
      handleError(error); // Xử lý lỗi với hàm riêng
    }
  };

  // Kiểm tra xem voucher có hợp lệ không
  const validateVoucher = async (voucherCode) => {
    try {
      const response = await axiosInstance.get(`/api/user-vouchers/validate`, {
        params: { voucherCode },
      });
      return response.data; // Trả về thông tin kiểm tra voucher
    } catch (error) {
      handleError(error); // Xử lý lỗi với hàm riêng
    }
  };

  return { getUserVouchers, getVoucherById, useVoucher, validateVoucher };
};

export default UserVoucherService;

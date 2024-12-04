// cartService.js
import useAxios from '../useAxios'; // Đảm bảo đường dẫn đúng

const CartService = () => {
  const axiosInstance = useAxios();

  const getCarts = async () => {
    try {
      const response = await axiosInstance.get('/carts');
      return response.data;
    } catch (error) {
      handleAxiosError(error, 'Không thể lấy danh sách giỏ hàng');
    }
  };

  const addToCart = async (cartModel) => {
    try {
      const response = await axiosInstance.post('/carts/add-to-cart', cartModel);
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.message || error.message;

        if (status === 404) {
          throw new Error('Người dùng không tìm thấy');
        } else if (status === 400) {
          if (errorMessage.includes('Phiên bản sản phẩm không tìm thấy')) {
            throw new Error('Phiên bản sản phẩm không tìm thấy');
          } else if (errorMessage.includes('Số lượng vượt quá sản phẩm tồn kho')) {
            throw new Error('Số lượng vượt quá sản phẩm tồn kho');
          }
        }
      }
      handleAxiosError(error, 'Đã xảy ra lỗi không mong muốn');
    }
  };

  const updateCartQuantity = async (cartModel) => {
    try {
      const response = await axiosInstance.put('/carts/update', cartModel);
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.message || error.message;

        if (status === 404) {
          throw new Error('Sản phẩm trong giỏ hàng không tìm thấy');
        } else if (status === 400) {
          if (errorMessage.includes('Số lượng vượt quá sản phẩm tồn kho')) {
            throw new Error('Số lượng vượt quá sản phẩm tồn kho');
          } else if (errorMessage.includes('Phiên bản sản phẩm không tìm thấy')) {
            throw new Error('Phiên bản sản phẩm không tìm thấy');
          }
        }
      }
      handleAxiosError(error, 'Đã xảy ra lỗi không mong muốn');
    }
  };

  const deleteCartItem = async (productVersionID) => {
    try {
      const response = await axiosInstance.delete(`/carts/${productVersionID}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error, 'Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const getTotalCartQuantity = async () => {
    try {
      const response = await axiosInstance.get('/carts/total-quantity');
      return response.data;
    } catch (error) {
      handleAxiosError(error, 'Không thể lấy tổng số lượng sản phẩm trong giỏ hàng');
    }
  };

  const handleAxiosError = (error, defaultMessage) => {
    console.error('Error:', error);
    if (error.response) {
      console.log('Response error data:', error.response.data);
      console.log('Response status:', error.response.status);
      console.log('Response headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Request setup error:', error.message);
    }
    throw new Error(defaultMessage || 'Đã xảy ra lỗi');
  };

  return { getCarts, addToCart, updateCartQuantity, deleteCartItem, getTotalCartQuantity };
};

export default CartService;

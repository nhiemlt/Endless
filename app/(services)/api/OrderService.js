import { useAxios } from '../useAxios'; // Import useAxios hook

const OrderService = () => {
  const axiosInstance = useAxios(); // Sử dụng hook useAxios để lấy axios instance

  // Lấy tất cả đơn hàng của người dùng hiện tại
  const getAllOrderByUserLogin = async (searchText) => {
    try {
      const response = await axiosInstance.get(`/orders/user`, {
        params: { searchText },
      });
      return response.data; // Trả về dữ liệu API
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error.response?.data || error.message;
    }
  };

  // Tạo đơn hàng mới từ frontend
  const createOrder = async (orderModel) => {
    try {
      console.log(orderModel);
      const response = await axiosInstance.post(`/orders`, orderModel);
      return response.data; // Trả về dữ liệu API
    } catch (error) {
      console.error("Error creating order:", error.response?.data || error.message);
      throw error;
    }
  };

  // Tạo đơn hàng mới VNPAY
  const createOrderOnline = async (orderModel) => {
    try {
      const response = await axiosInstance.post(`/orders/create-order-online`, orderModel);
      return response.data; // Trả về dữ liệu API
    } catch (error) {
      console.error("Error creating VNPAY order:", error);
      throw error.response?.data || error.message;
    }
  };

  // Tạo đơn hàng thanh toán (gọi API tạo thanh toán ZaloPay)
  const createPayment = async (orderId) => {
    try {
      const response = await axiosInstance.post(`/api/payment/create/${orderId}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Error creating payment with ZaloPay:", error);
      throw error;
    }
  };

  // Tạo URL thanh toán VNPAY
  const createVNPayPaymentUrl = async (orderId) => {
    try {
      const response = await axiosInstance.post(`/api/payment/create-payment-url/${orderId}`);
      return response.data; // Trả về URL thanh toán từ API
    } catch (error) {
      console.error("Error creating VNPAY payment URL:", error);
      throw error.response?.data || error.message;
    }
  };

  // Lấy thông tin đơn hàng theo ID
  const getOrderById = async (id) => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data; // Trả về dữ liệu API
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error.response?.data || error.message;
    }
  };

  // Lấy chi tiết đơn hàng theo ID
  const getOrderDetailsByOrderId = async (id) => {
    try {
      const response = await axiosInstance.get(`/orders/${id}/details`);
      return response.data; // Trả về dữ liệu API
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error.response?.data || error.message;
    }
  };

  // Hủy đơn hàng theo ID
  const cancelOrder = async (orderId) => {
    try {
      const response = await axiosInstance.post(`/orders/${orderId}/cancel`);
      return response.data; // Trả về dữ liệu API
    } catch (error) {
      console.error("Error canceling order:", error);
      throw error.response?.data || error.message;
    }
  };

  // Đánh dấu đơn hàng là đã giao
  const markOrderAsDelivered = async (orderId) => {
    try {
      const response = await axiosInstance.post(`/orders/mark-as-delivered`, { orderId });
      return response.data; // Trả về dữ liệu API
    } catch (error) {
      console.error("Error marking order as delivered:", error);
      throw error.response?.data || error.message;
    }
  };

  return {
    getAllOrderByUserLogin,
    createOrder,
    createOrderOnline,
    createPayment,
    createVNPayPaymentUrl,
    getOrderById,
    getOrderDetailsByOrderId,
    cancelOrder,
    markOrderAsDelivered,
  };
};

export default OrderService;

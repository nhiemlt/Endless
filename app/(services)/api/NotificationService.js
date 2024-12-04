import { useAxios } from '../useAxios'; // Import hook useAxios

const NotificationService = () => {
  const axiosInstance = useAxios(); // Sử dụng useAxios hook để lấy axios instance

  // Lấy danh sách thông báo cho người dùng đăng nhập hiện tại
  const getNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications/user');
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy tất cả thông báo:", error);
      throw error.response?.data || error.message;
    }
  };

  // Đánh dấu một thông báo là đã đọc
  const markAsRead = async (notificationRecipientId) => {
    try {
      const response = await axiosInstance.post('/notifications/markAsRead', { notificationRecipientId });
      return response.data.message; // Trả về thông báo thành công
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
      throw error.response?.data || error.message;
    }
  };

  // Đánh dấu tất cả thông báo là đã đọc
  const markAllAsRead = async () => {
    try {
      const response = await axiosInstance.post('/notifications/markAllAsRead');
      return response.data.message; // Trả về thông báo thành công
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc:", error);
      throw error.response?.data || error.message;
    }
  };

  // Xóa một thông báo nhận
  const deleteNotificationReception = async (notificationRecipientID) => {
    try {
      await axiosInstance.delete(`/notifications/delete/${notificationRecipientID}`);
    } catch (error) {
      console.error("Lỗi khi xóa thông báo:", error);
      throw error.response?.data || error.message;
    }
  };

  // Lấy số lượng thông báo chưa đọc
  const getUnreadCount = async () => {
    try {
      const response = await axiosInstance.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", error);
      throw error.response?.data || error.message;
    }
  };

  return {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotificationReception,
    getUnreadCount,
  };
};

export default NotificationService;

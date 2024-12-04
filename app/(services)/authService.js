import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../(redux)/authSlice';
import { useRouter } from 'expo-router';
import { domain } from '../../constants/Domain';

export const useAuthService = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${domain}/verify-auth-token?token=${token}`, {
        method: 'GET',
      });
  
      // Kiểm tra phản hồi có hợp lệ không
      if (!response.ok) {
        console.error('Lỗi: Phản hồi không thành công từ máy chủ.');
        
      }
  
      const data = await response.json(); // Sử dụng json() thay vì text()
  
      if (!data.success) {
        console.warn(`Xác thực token thất bại: ${data.message || 'Lý do không xác định'}`);
        return false;
      }
  
      // Kiểm tra role là "customer"
      if (data.role !== 'customer') {
        console.warn('Token không hợp lệ: Role không phải là "customer"');
        return false;
      }
  
      console.info('Token hợp lệ với role là "customer".');
      return true;
    } catch (error) {
      console.error('Lỗi khi kiểm tra token:', error.message);
      return false;
    }
  };
  

  // Kiểm tra tính hợp lệ của token
  const checkTokenValidity = async () => {
    if (!token) {
      console.warn('Bạn cần đăng nhập để sử dụng tính năng này');
      dispatch(logoutAction());
      router.replace('/auth/login');
      return;
    }

    // Kiểm tra tính hợp lệ của token trước khi gọi API
    const isValid = await verifyToken(token);

    if (!isValid) {
      console.warn('Token không hợp lệ. Bạn cần đăng nhập lại.');
      dispatch(logoutAction());
      router.replace('/auth/login');
    }
  };

  return { checkTokenValidity };
};

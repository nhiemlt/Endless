import { useAxios } from '../useAxios'; // Import useAxios hook

const ProductService = () => {
  const axiosInstance = useAxios(); // Lấy axios instance từ useAxios hook

  // Lấy danh sách sản phẩm hoặc thông tin chi tiết theo ID
  const getProducts = async (keyword, page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get('/api/products', {
        params: { keyword, page, size }
      });
      return response.data; // Trả về toàn bộ dữ liệu phân trang
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };

  // Phương thức để lấy danh sách danh mục
  const getCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/categories');
      return response.data.content; // Trả về danh sách danh mục
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };

  // Phương thức để lấy danh sách thương hiệu
  const getBrands = async () => {
    try {
      const response = await axiosInstance.get('/api/brands');
      return response.data.content; // Trả về danh sách thương hiệu
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };

  // Lấy thông tin sản phẩm theo ID
  const getProductById = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/products/${id}`);
      return response.data; // Trả về sản phẩm theo ID
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };

  return {
    getProducts,
    getCategories,
    getBrands,
    getProductById
  };
};

export default ProductService;

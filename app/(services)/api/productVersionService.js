import { useAxios } from '../useAxios'; // Import useAxios hook

const ProductVersionService = () => {
  const axiosInstance = useAxios(); // Lấy axios instance từ useAxios hook

  // Tìm kiếm phiên bản sản phẩm
  const searchProductVersions = async (page = 0, size = 10, sortBy = 'versionName', direction = 'ASC', keyword = '') => {
    try {
      const response = await axiosInstance.get('/get-user', {
        params: { page, size, sortBy, direction, keyword },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching product versions:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Lấy thông tin phiên bản sản phẩm theo ID
  const getProductVersionById = async (id) => {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product version with id ${id}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Lọc phiên bản sản phẩm theo các điều kiện
  const filterProductVersions = async (filterData) => {
    try {
      const response = await axiosInstance.post('/filter', filterData);
      return response.data;
    } catch (error) {
      console.error("Error filtering product versions:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Lấy các phiên bản sản phẩm bán chạy nhất
  const getTopSellingProductVersions = async (page = 0, size = 5) => {
    try {
      const response = await axiosInstance.get('/top-selling', { params: { page, size } });
      return response.data;
    } catch (error) {
      console.error("Error fetching top-selling product versions:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Lấy các phiên bản sản phẩm bán chạy nhất mọi thời đại
  const getTopSellingProductVersionsAllTime = async (page = 0, size = 5) => {
    try {
      const response = await axiosInstance.get('/top-selling/all-time', { params: { page, size } });
      return response.data;
    } catch (error) {
      console.error("Error fetching top-selling product versions of all time:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Lấy các phiên bản sản phẩm bán chạy theo danh mục
  const getTopSellingProductsByCategory = async (categoryID, page = 0, size = 5) => {
    try {
      const response = await axiosInstance.get(`/top5ByCategory/${categoryID}`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching top-selling products by category ${categoryID}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Lấy các phiên bản sản phẩm bán chạy theo thương hiệu
  const getTopSellingProductsByBrand = async (brandID, page = 0, size = 5) => {
    try {
      const response = await axiosInstance.get(`/top5ByBrand/${brandID}`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching top-selling products by brand ${brandID}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Tạo mới phiên bản sản phẩm
  const createProductVersion = async (productVersionData) => {
    try {
      const response = await axiosInstance.post('/', productVersionData);
      return response.data;
    } catch (error) {
      console.error("Error creating product version:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Cập nhật phiên bản sản phẩm
  const updateProductVersion = async (id, productVersionData) => {
    try {
      const response = await axiosInstance.put(`/${id}`, productVersionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product version with id ${id}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Cập nhật trạng thái phiên bản sản phẩm
  const updateProductVersionStatus = async (id, status) => {
    try {
      const response = await axiosInstance.put(`/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating status for product version with id ${id}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Xóa phiên bản sản phẩm
  const deleteProductVersion = async (id) => {
    try {
      const response = await axiosInstance.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product version with id ${id}:`, error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Lấy tổng số sản phẩm
  const getProductCount = async () => {
    try {
      const response = await axiosInstance.get('/count-products');
      return response.data;
    } catch (error) {
      console.error("Error fetching product count:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Lấy tổng số thương hiệu
  const getBrandCount = async () => {
    try {
      const response = await axiosInstance.get('/count-brands');
      return response.data;
    } catch (error) {
      console.error("Error fetching brand count:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  // Lấy danh sách các phiên bản sản phẩm đã sắp xếp
  const getSortedProductVersions = async (sortBy = 'versionName', direction = 'ASC') => {
    try {
      const response = await axiosInstance.get('/sorted', {
        params: { sortBy, direction }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sorted product versions:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  return {
    searchProductVersions,
    getProductVersionById,
    filterProductVersions,
    getTopSellingProductVersions,
    getTopSellingProductVersionsAllTime,
    getTopSellingProductsByCategory,
    getTopSellingProductsByBrand,
    createProductVersion,
    updateProductVersion,
    updateProductVersionStatus,
    deleteProductVersion,
    getProductCount,
    getBrandCount,
    getSortedProductVersions
  };
};

export default ProductVersionService;

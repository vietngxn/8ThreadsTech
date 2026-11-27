import api from "./api";

/**
 * Service quản trị sản phẩm tại /api/admin/products (yêu cầu JWT ADMIN).
 */
export const adminProductService = {
  /**
   * Danh sách sản phẩm có phân trang, lọc và summary
   */
  async getProducts(params = {}) {
    const queryParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams[key] = value;
      }
    });

    const response = await api.get("/api/admin/products", {
      params: queryParams,
    });
    const data = response.data?.data || {};
    return {
      products: data.products || {
        content: [],
        pageNumber: 0,
        pageSize: 8,
        totalElements: 0,
        totalPages: 1,
        last: true,
      },
      summary: data.summary || {
        allProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        inStockProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
      },
    };
  },

  /**
   * Danh mục và thương hiệu đang hoạt động cho select trong form
   */
  async getOptions() {
    const response = await api.get("/api/admin/products/options");
    const data = response.data?.data || {};
    return {
      categories: Array.isArray(data.categories) ? data.categories : [],
      brands: Array.isArray(data.brands) ? data.brands : [],
    };
  },

  /**
   * Chi tiết sản phẩm phục vụ form chỉnh sửa
   */
  async getProductDetail(id) {
    const response = await api.get(`/api/admin/products/${id}`);
    return response.data?.data;
  },

  /**
   * Tạo sản phẩm mới kèm variants & images
   */
  async createProduct(payload) {
    const response = await api.post("/api/admin/products", payload);
    return response.data?.data;
  },

  /**
   * Cập nhật sản phẩm, đồng bộ variants/images
   */
  async updateProduct(id, payload) {
    const response = await api.put(`/api/admin/products/${id}`, payload);
    return response.data?.data;
  },

  /**
   * Xóa sản phẩm
   */
  async deleteProduct(id) {
    const response = await api.delete(`/api/admin/products/${id}`);
    return response.data;
  },
};

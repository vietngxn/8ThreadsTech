import api from "./api";

export const userService = {
  /**
   * Lấy thông tin hồ sơ của người dùng hiện tại (yêu cầu JWT)
   */
  async getMyProfile() {
    const response = await api.get("/api/users/me");
    return response.data?.data;
  },

  /**
   * Cập nhật thông tin hồ sơ
   */
  async updateProfile(data) {
    const response = await api.put("/api/users/me", data);
    return response.data?.data;
  },

  /**
   * Lấy danh sách sổ địa chỉ
   */
  async getMyAddresses() {
    const response = await api.get("/api/users/addresses");
    return response.data?.data || [];
  },

  /**
   * Thêm địa chỉ mới
   */
  async createAddress(data) {
    const response = await api.post("/api/users/addresses", data);
    return response.data?.data;
  },

  /**
   * Cập nhật địa chỉ
   */
  async updateAddress(id, data) {
    const response = await api.put(`/api/users/addresses/${id}`, data);
    return response.data?.data;
  },

  /**
   * Xóa địa chỉ
   */
  async deleteAddress(id) {
    const response = await api.delete(`/api/users/addresses/${id}`);
    return response.data;
  },

  /**
   * Đặt địa chỉ làm mặc định
   */
  async setDefaultAddress(id) {
    const response = await api.put(`/api/users/addresses/${id}/default`);
    return response.data?.data;
  },

  /**
   * Lấy danh sách đơn hàng của người dùng
   */
  async getMyOrders() {
    const response = await api.get("/api/users/orders");
    return response.data?.data || [];
  },

  /**
   * Lấy chi tiết đơn hàng theo mã đơn
   */
  async getOrderDetails(orderCode) {
    const response = await api.get(`/api/users/orders/${orderCode}`);
    return response.data?.data;
  },
};

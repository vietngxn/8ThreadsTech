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
};


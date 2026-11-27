import api from "./api";

/**
 * Service trang Tổng quan Admin tại /api/admin/dashboard (yêu cầu JWT ADMIN).
 */
export const adminDashboardService = {
  /**
   * @param {number} days - Số ngày thống kê tính đến hôm nay (1–90)
   */
  async getDashboard(days = 7) {
    const response = await api.get("/api/admin/dashboard", { params: { days } });
    return response.data?.data;
  },
};
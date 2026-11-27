import api from "./api";

/**
 * Service quản trị khuyến mãi tại /api/admin/coupons (yêu cầu JWT ADMIN).
 */
export const adminCouponService = {
  /**
   * Danh sách khuyến mãi có phân trang, tìm kiếm và lọc.
   * @param {Object} params - { page, size, sortBy, sortDirection, search, status }
   */
  async getCoupons(params = {}) {
    const queryParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        queryParams[key] = value;
      }
    });
    const response = await api.get("/api/admin/coupons", { params: queryParams });
    const data = response.data?.data || {};
    return {
      content: data.content || [],
      pageNumber: data.pageNumber ?? 0,
      pageSize: data.pageSize ?? 10,
      totalElements: data.totalElements ?? 0,
      totalPages: data.totalPages ?? 1,
      last: data.last ?? true,
    };
  },

  /**
   * Chi tiết khuyến mãi theo ID.
   * @param {number} id
   */
  async getCoupon(id) {
    const response = await api.get(`/api/admin/coupons/${id}`);
    return response.data?.data;
  },

  /**
   * Tạo khuyến mãi mới.
   * @param {Object} payload
   */
  async createCoupon(payload) {
    const response = await api.post("/api/admin/coupons", payload);
    return response.data?.data;
  },

  /**
   * Cập nhật khuyến mãi.
   * @param {number} id
   * @param {Object} payload
   */
  async updateCoupon(id, payload) {
    const response = await api.put(`/api/admin/coupons/${id}`, payload);
    return response.data?.data;
  },

  /**
   * Xóa khuyến mãi (chỉ khi chưa có lịch sử sử dụng).
   * @param {number} id
   */
  async deleteCoupon(id) {
    const response = await api.delete(`/api/admin/coupons/${id}`);
    return response.data;
  },
};

export const COUPON_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const COUPON_STATUS_LABELS = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Tạm dừng",
};

export const DISCOUNT_TYPE_LABELS = {
  PERCENTAGE: "Phần trăm",
  FIXED: "Cố định",
};

/** Trả trạng thái hiển thị dựa trên status + thời gian */
export function getCouponDisplayStatus(coupon) {
  const now = new Date();
  const start = coupon.startsAt ? new Date(coupon.startsAt) : null;
  const end = coupon.expiresAt ? new Date(coupon.expiresAt) : null;

  if (coupon.status === "INACTIVE") return "inactive";
  if (end && now > end) return "ended";
  if (start && now < start) return "upcoming";
  return "active";
}

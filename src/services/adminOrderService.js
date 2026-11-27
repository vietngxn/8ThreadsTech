import api from "./api";

/**
 * Service quản trị đơn hàng tại /api/admin/orders (yêu cầu JWT ADMIN).
 */
export const adminOrderService = {
  /**
   * Danh sách đơn có phân trang, tìm kiếm và lọc theo trạng thái.
   * @param {Object} params - { page, size, sortBy, sortDirection, search, status }
   */
  async getOrders(params = {}) {
    const queryParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        queryParams[key] = value;
      }
    });

    const response = await api.get("/api/admin/orders", { params: queryParams });
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
   * Chi tiết đơn hàng theo orderCode.
   * @param {string} orderCode
   */
  async getOrderDetail(orderCode) {
    const response = await api.get(`/api/admin/orders/${orderCode}`);
    return response.data?.data;
  },

  /**
   * Cập nhật trạng thái đơn.
   * @param {string} orderCode
   * @param {string} status - Trạng thái mới
   * @param {string} [note] - Bắt buộc khi hủy, tùy chọn các trường hợp khác
   */
  async updateStatus(orderCode, status, note) {
    const payload = { status };
    if (note !== undefined && note !== null && note !== "") {
      payload.note = note;
    }
    const response = await api.patch(`/api/admin/orders/${orderCode}/status`, payload);
    return response.data?.data;
  },
};

/** Luồng trạng thái hợp lệ theo tài liệu backend */
export const ORDER_STATUS_TRANSITIONS = {
  PENDING_PAYMENT: ["CANCELLED"],
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

/** Nhãn hiển thị cho từng trạng thái */
export const ORDER_STATUS_LABELS = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

/** Nhãn hiển thị cho trạng thái thanh toán */
export const PAYMENT_STATUS_LABELS = {
  UNPAID: "Chưa thu",
  PAID: "Đã thanh toán",
  REFUND_PENDING: "Chờ hoàn tiền",
  REFUNDED: "Đã hoàn tiền",
};

import api from "./api";

/**
 * Đặt hàng, xem và hủy đơn. Khớp với OrderController và ShippingMethodController của BE.
 */
export const orderService = {
  async getMyOrders() {
    const response = await api.get("/api/users/orders");
    return response.data?.data || [];
  },
  /** Danh sách phương thức vận chuyển đang bán (code, name, description, baseCost) */
  async getShippingMethods() {
    const response = await api.get("/api/shipping-methods");
    return response.data?.data || [];
  },

  /** Tạo đơn từ các dòng giỏ hàng đã chọn. Trả về OrderResponse (có orderCode). */
  async createOrder(payload) {
    const response = await api.post("/api/orders", payload);
    return response.data?.data;
  },

  /** Chi tiết một đơn của người dùng hiện tại */
  async getOrder(orderCode) {
    const response = await api.get(
      `/api/orders/${encodeURIComponent(orderCode)}`
    );
    return response.data?.data;
  },

  /** Hủy đơn đang chờ xác nhận. BE hoàn lại tồn kho. */
  async cancelOrder(orderCode, reason) {
    const response = await api.post(
      `/api/orders/${encodeURIComponent(orderCode)}/cancel`,
      { reason: reason || null }
    );
    return response.data?.data;
  },

    /** Xem trước mã khuyến mãi (chỉ để hiển thị, BE tính lại khi đặt hàng) */
  async previewCoupon(code, subtotal) {
    const response = await api.post("/api/coupons/preview", { code, subtotal });
    return response.data?.data;
  },
};

/**
 * Gom thông báo lỗi dễ đọc từ phản hồi của BE.
 * Lỗi validate (400) có dạng { message, data: { tenTruong: "thong bao" } }.
 */
export function getOrderErrorMessage(error) {
  const data = error?.response?.data;

  if (data?.data && typeof data.data === "object") {
    const details = Object.values(data.data).filter(Boolean);
    if (details.length > 0) return details.join(". ");
  }

  return error?.message || "Không thể đặt hàng. Vui lòng thử lại.";
}

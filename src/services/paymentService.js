import api from "./api";

const PENDING_ORDER_KEY = "pendingPaymentOrderCode";

export const paymentService = {
  async getMethods() {
    const response = await api.get("/api/payments/methods");
    return response.data?.data || [];
  },

  async startPayment(orderCode) {
    const response = await api.post(`/api/payments/${encodeURIComponent(orderCode)}/start`);
    return response.data?.data?.paymentUrl;
  },

  async getStatus(orderCode) {
    const response = await api.get(`/api/payments/${encodeURIComponent(orderCode)}/status`);
    return response.data?.data;
  },

  async confirmReturn(orderCode, params) {
    const response = await api.post(
      `/api/payments/${encodeURIComponent(orderCode)}/confirm-return`, params);
    return response.data?.data;
  },

  /** Lấy link rồi chuyển hẳn trình duyệt sang trang của cổng */
  async redirectToGateway(orderCode) {
    const paymentUrl = await this.startPayment(orderCode);
    if (!paymentUrl) throw new Error("Không tạo được liên kết thanh toán.");

    sessionStorage.setItem(PENDING_ORDER_KEY, orderCode);
    window.location.href = paymentUrl;
  },

  getPendingOrderCode() { return sessionStorage.getItem(PENDING_ORDER_KEY); },
  clearPendingOrderCode() { sessionStorage.removeItem(PENDING_ORDER_KEY); },
};
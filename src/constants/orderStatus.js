/**
 * Ánh xạ trạng thái BE -> hiển thị. Một chỗ duy nhất: BE thêm trạng thái thì chỉ sửa ở đây.
 * group: khóa lọc trên trang Đơn hàng, đồng thời là hậu tố class CSS (order-status--{group}).
 */
export const ORDER_STATUS = {
  PENDING_PAYMENT: { group: "unpaid", label: "Chờ thanh toán" },
  PENDING: { group: "pending", label: "Đã tiếp nhận · Chờ xác nhận" },
  CONFIRMED: { group: "processing", label: "Đã xác nhận · Đang chuẩn bị" },
  SHIPPING: { group: "shipping", label: "Đang giao hàng" },
  DELIVERED: { group: "delivered", label: "Đã giao hàng" },
  CANCELLED: { group: "cancelled", label: "Đã hủy" },
};

export const ORDER_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "unpaid", label: "Chờ thanh toán" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "processing", label: "Đã xác nhận" },
  { id: "shipping", label: "Đang giao" },
  { id: "delivered", label: "Đã giao" },
  { id: "cancelled", label: "Đã hủy" },
];

const PAYMENT_STATUS_LABEL = {
  PAID: "Đã thanh toán",
  UNPAID: "Chưa thanh toán",
  REFUND_PENDING: "Đang chờ hoàn tiền",
};

const PAYMENT_METHOD_LABEL = {
  COD: "COD",
  VNPAY: "VNPAY",
  MOMO: "MoMo",
};

export function getStatusInfo(status) {
  return ORDER_STATUS[status] || { group: "pending", label: status || "" };
}

export function describePayment(paymentStatus, paymentMethod) {
  const statusText = PAYMENT_STATUS_LABEL[paymentStatus] || "Chưa thanh toán";
  const methodText = PAYMENT_METHOD_LABEL[paymentMethod] || paymentMethod || "COD";
  return `${statusText} · ${methodText}`;
}
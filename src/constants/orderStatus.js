/**
 * Ánh xạ trạng thái BE -> hiển thị, tên theo đặc tả (yêu cầu 35, UC27). Một chỗ duy nhất: BE thêm trạng thái thì chỉ sửa ở đây.
 * group: khóa lọc trên trang Đơn hàng, đồng thời là hậu tố class CSS (order-status--{group}).
 */
export const ORDER_STATUS = {
  PENDING_PAYMENT: { group: "unpaid", label: "Chờ thanh toán" },
  PENDING: { group: "pending", label: "Chờ xác nhận" },
  CONFIRMED: { group: "processing", label: "Đang xử lý" },
  SHIPPING: { group: "shipping", label: "Đang giao hàng" },
  DELIVERED: { group: "delivered", label: "Hoàn thành" },
  CANCELLED: { group: "cancelled", label: "Đã hủy" },
};

export const ORDER_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "unpaid", label: "Chờ thanh toán" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "processing", label: "Đang xử lý" },
  { id: "shipping", label: "Đang giao hàng" },
  { id: "delivered", label: "Hoàn thành" },
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
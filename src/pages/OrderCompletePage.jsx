import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import CartFooter from "../components/cart/CartFooter";
import OrderCompleteHeader from "../components/order/OrderCompleteHeader";
import OrderSuccess from "../components/order/OrderSuccess";
import OrderNextSteps from "../components/order/OrderNextSteps";
import OrderDelivery from "../components/order/OrderDelivery";
import OrderShipping from "../components/order/OrderShipping";
import OrderSummary from "../components/order/OrderSummary";
import { useCart } from "../hooks/useCart";
import { orderService } from "../services/orderService";
import fallbackImage from "../assets/list-thread-75.png";

const STATUS_LABELS = {
  PENDING: "Đã tiếp nhận · Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy",
};

// selectedOptions là chuỗi JSON do giỏ hàng lưu, ví dụ {"color":"Đen","switch":"Red"}
function describeOptions(raw) {
  if (!raw) return "";
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === "object") {
      return Object.values(parsed).filter(Boolean).join(" · ");
    }
  } catch {
    // không phải JSON thì hiển thị nguyên văn
  }
  return String(raw);
}

export default function OrderCompletePage() {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    orderService
      .getOrder(orderCode)
      .then((data) => {
        if (active) setOrder(data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Không tìm thấy đơn hàng.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderCode]);

  const items = useMemo(
    () =>
      (order?.items || []).map((item) => ({
        key: `${item.productVariantId}-${item.productSku}`,
        name: item.productName,
        options: describeOptions(item.selectedOptions),
        quantity: item.quantity,
        lineTotal: item.lineTotal,
        image: item.productImageUrl || fallbackImage,
      })),
    [order]
  );

  return (
    <div className="order-complete-page" data-node-id="5:465">
      <Navbar quantity={cartCount} />

      <OrderCompleteHeader />

      <main className="order-complete-content" data-node-id="5:522">
        {loading ? (
          <p style={{ padding: "60px 20px", textAlign: "center" }}>
            Đang tải thông tin đơn hàng...
          </p>
        ) : error || !order ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <p style={{ color: "#ef4444", marginBottom: 16 }}>
              {error || "Không tìm thấy đơn hàng."}
            </p>
            <button
              type="button"
              className="order-button order-button--primary"
              onClick={() => navigate("/don-hang")}
            >
              XEM ĐƠN HÀNG CỦA TÔI
            </button>
          </div>
        ) : (
          <>
            <div className="order-confirmation-column">
              <OrderSuccess
                orderId={order.orderCode}
                statusLabel={STATUS_LABELS[order.status] || order.status}
              />
              <OrderNextSteps />
              <OrderDelivery order={order} />
              <OrderShipping order={order} />
            </div>
            <OrderSummary
              items={items}
              subtotal={order.subtotalAmount}
              discount={order.discountAmount}
              shippingFee={order.shippingFee}
              total={order.totalAmount}
            />
          </>
        )}
      </main>

      <CartFooter />
    </div>
  );
}

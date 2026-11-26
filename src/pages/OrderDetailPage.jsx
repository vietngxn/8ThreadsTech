import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import CartFooter from "../components/cart/CartFooter";
import OrderDetailIntro from "../components/order/OrderDetailIntro";
import OrderDetailMain from "../components/order/OrderDetailMain";
import { userService } from "../services/userService";
import { orderService } from "../services/orderService";
import { useCart } from "../hooks/useCart";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadOrder = async () => {
      try {
        let orderData = null;
        if (id && id !== "chi-tiet") {
          // id can be clean orderCode or with #
          const cleanCode = id.replace(/^#/, "");
          orderData = await userService.getOrderDetails(cleanCode);
        } else {
          // If no specific code, get latest order from list
          const orders = await userService.getMyOrders();
          if (orders && orders.length > 0) {
            orderData = orders[0];
          }
        }

        if (isMounted) {
          setOrder(orderData);
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Lỗi tải chi tiết đơn hàng:", err);
          setError(err.message || "Không tìm thấy đơn hàng");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Hủy đơn trên BE (hoàn kho), rồi tải lại để hiển thị trạng thái mới
  const handleCancel = async (reason) => {
    await orderService.cancelOrder(order.orderCode, reason);
    const fresh = await userService.getOrderDetails(order.orderCode);
    setOrder(fresh);
  };

  return (
    <div className="order-detail-page" data-node-id="15:1238">
      <Navbar quantity={cartCount} />

      <main>
        <OrderDetailIntro />
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#a1a1aa" }}>
            Đang tải thông tin chi tiết đơn hàng...
          </div>
        ) : error && !order ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: "#ef4444", marginBottom: 16 }}>{error}</p>
            <button
              type="button"
              className="order-button order-button--primary"
              onClick={() => navigate("/don-hang")}
            >
              QUAY LẠI DANH SÁCH ĐƠN HÀNG
            </button>
          </div>
        ) : (
          <OrderDetailMain order={order} onCancel={handleCancel} />
        )}
      </main>

      <CartFooter />
    </div>
  );
}

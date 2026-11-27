import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import CartFooter from "../components/cart/CartFooter";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersList from "../components/orders/OrdersList";
import thread75Image from "../assets/list-thread-75.png";
import {
  IconChevronRight,
  IconLock,
  IconLogout,
  IconMapPin,
  IconPackage,
  IconUser,
} from "@tabler/icons-react";
import { authService } from "../services/authService";
import { orderService } from "../services/orderService";
import { userService } from "../services/userService";
import { paymentService } from "../services/paymentService";
import { ORDER_FILTERS, getStatusInfo, describePayment } from "../constants/orderStatus";
import { useCart } from "../hooks/useCart";


function OrdersSidebar() {
  const currentUser = authService.getCurrentUser();
  const displayName = currentUser?.fullName || currentUser?.name || "Khách hàng 8Threads";
  const displayEmail = currentUser?.email || "";

  const getInitials = (name) => {
    if (!name) return "8T";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <aside className="orders-sidebar">
      <div className="orders-identity">
        <div className="orders-avatar" aria-hidden="true">{getInitials(displayName)}</div>
        <div className="orders-identity-copy">
          <strong>{displayName}</strong>
          <span>{displayEmail}</span>
        </div>
        <small>TÀI KHOẢN NGƯỜI DÙNG</small>
      </div>
      <div className="orders-sidebar-rule" />
      <nav className="orders-account-menu" aria-label="Điều hướng tài khoản">
        <a href="/ho-so"><IconUser /><span>Hồ sơ cá nhân</span><IconChevronRight /></a>
        <a className="is-active" href="/don-hang" aria-current="page">
          <IconPackage /><span>Đơn hàng của tôi</span><IconChevronRight />
        </a>
        <a href="/so-dia-chi"><IconMapPin /><span>Sổ địa chỉ</span><IconChevronRight /></a>
        <a href="/doi-mat-khau"><IconLock /><span>Đổi mật khẩu</span><IconChevronRight /></a>
        <button
          type="button"
          className="profile-logout"
          onClick={() => authService.logout("/dang-nhap")}
        >
          <IconLogout />
          <span>Đăng xuất</span>
        </button>
      </nav>
      <div className="orders-sidebar-rule orders-help-rule" />
      <div className="orders-help">
        <p>Cần hỗ trợ về tài khoản của bạn?</p>
        <a href="mailto:hello@8threadtech.vn">NHẮN TIN CHO 8THREADS</a>
      </div>
    </aside>
  );
}

const CACHE_ORDERS_KEY = "cached_user_orders";

const formatPrice = (price) => `${Number(price || 0).toLocaleString("vi-VN")} ₫`;

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

// selectedOptions là chuỗi JSON, ví dụ {"color":"Đen","switch":"Red"}: hiển thị gọn thay vì chuỗi thô
function describeOptions(raw) {
  if (!raw) return "";
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === "object") {
      return Object.values(parsed).filter(Boolean).join(" · ");
    }
  } catch {
    // không phải JSON thì dùng nguyên văn
  }
  return String(raw);
}

// Dòng phụ dưới tổng tiền: hạn thanh toán / lý do hủy / phương thức giao
function describeDelivery(o) {
  if (o.canPay && o.paymentDeadline) {
    return `Thanh toán trước ${formatTime(o.paymentDeadline)} để giữ đơn`;
  }
  if (o.status === "CANCELLED") {
    return o.cancelReason || "Đơn đã hủy";
  }
  const fee = Number(o.shippingFee || 0);
  const feeText = fee === 0 ? "Miễn phí vận chuyển" : `Phí giao ${formatPrice(fee)}`;
  return [o.shippingMethodName, feeText].filter(Boolean).join(" · ");
}

// OrderResponse của BE -> dữ liệu cho OrderCard
function mapOrder(o) {
  const info = getStatusInfo(o.status);

  return {
    id: `#${o.orderCode}`,
    orderCode: o.orderCode,
    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("vi-VN") : "",
    rawStatus: o.status,
    status: info.group,
    statusLabel: o.statusLabel || info.label,
    payment: describePayment(o.paymentStatus, o.paymentMethod),
    canCancel: Boolean(o.canCancel),
    canPay: Boolean(o.canPay),
    products: (o.items || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.productName,
      variant: describeOptions(item.selectedOptions),
      price: Number(item.unitPrice || 0),
      quantity: item.quantity || 1,
      image: item.productImageUrl || thread75Image,
      reviewed: Boolean(item.reviewed || item.isReviewed || item.reviewId),
    })),
    total: Number(o.totalAmount || 0),
    deliveryAddress: o.deliveryAddress,
    delivery: describeDelivery(o),
  };
}

function getCachedOrders() {
  try {
    const raw = localStorage.getItem(CACHE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCache(orders) {
  localStorage.setItem(CACHE_ORDERS_KEY, JSON.stringify(orders));
}

/** Đọc một lần khi vào trang: có phải vừa quay về từ VNPAY/MoMo không? */
function readGatewayReturn(search) {
  const params = Object.fromEntries(new URLSearchParams(search));
  const fromGateway = "vnp_TxnRef" in params || "partnerCode" in params;
  if (!fromGateway) return null;
  return { params, orderCode: paymentService.getPendingOrderCode() };
}

const BANNER_STYLES = {
  success: { border: "1px solid #22c55e", background: "rgba(34, 197, 94, 0.1)" },
  warning: { border: "1px solid #f59e0b", background: "rgba(245, 158, 11, 0.1)" },
  error: { border: "1px solid #ef4444", background: "rgba(239, 68, 68, 0.1)" },
};

export default function OrdersPage() {
  const location = useLocation();
  const { cartCount } = useCart();

  // Hai cách vào trang ngay sau khi mua: đặt COD xong (state) hoặc cổng thanh toán trả về (query)
  const [justOrdered] = useState(() => location.state?.justOrdered || null);
  const [gatewayReturn] = useState(() => readGatewayReturn(location.search));
  const fresh = Boolean(justOrdered || gatewayReturn);

  const [banner, setBanner] = useState(() => {
    if (location.state?.paymentError) {
      return { type: "error", text: location.state.paymentError };
    }
    if (justOrdered) {
      return {
        type: "success",
        text: `Đặt hàng thành công! Mã đơn ${justOrdered}. Bạn thanh toán khi nhận hàng (COD), 8Threads sẽ gọi điện xác nhận.`,
      };
    }
    if (gatewayReturn) {
      return { type: "warning", text: "Đang xác nhận kết quả thanh toán..." };
    }
    return null;
  });

  const [filter, setFilter] = useState("all");
  // Vừa mua xong thì không hiện cache cũ (thiếu đơn mới / sai trạng thái)
  const [orders, setOrders] = useState(() => (fresh ? [] : getCachedOrders()));
  const [loading, setLoading] = useState(() => fresh || getCachedOrders().length === 0);

  useEffect(() => {
    let active = true;

    async function load() {
      // 1. Quay về từ cổng: xác nhận TRƯỚC rồi mới tải danh sách, để đơn hiện đúng trạng thái mới
      if (gatewayReturn) {
        // Xóa query khỏi thanh địa chỉ: F5 không gửi lại, mã giao dịch không nằm trên URL
        window.history.replaceState({}, "", "/don-hang");

        if (!gatewayReturn.orderCode) {
          setBanner({ type: "warning", text: "Đã quay về từ cổng thanh toán. Kiểm tra trạng thái đơn bên dưới." });
        } else {
          try {
            const result = await paymentService.confirmReturn(
              gatewayReturn.orderCode,
              gatewayReturn.params
            );
            paymentService.clearPendingOrderCode();

            if (!active) return;
            setBanner(result?.paid
              ? { type: "success", text: `Thanh toán thành công! Đơn ${result.orderCode} đang chờ 8Threads xác nhận.` }
              : { type: "error", text: `Đơn ${gatewayReturn.orderCode} chưa được thanh toán. Bạn có thể bấm "THANH TOÁN" để thử lại trước khi hết hạn.` });
          } catch (err) {
            if (active) setBanner({ type: "error", text: err.message || "Không xác nhận được kết quả thanh toán." });
          }
        }
      } else if (justOrdered || location.state?.paymentError) {
        // Làm mới trang không hiện lại thông báo
        window.history.replaceState({}, "");
      }

      // 2. Danh sách đơn
      try {
        const data = await userService.getMyOrders();
        if (!active) return;
        const mapped = data.map(mapOrder);
        setOrders(mapped);
        saveCache(mapped);
      } catch (err) {
        console.warn("Không thể tải danh sách đơn hàng:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
    // Chỉ chạy một lần khi vào trang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = orders.filter(
    (o) => filter === "all" || o.status === filter
  );

  // Thay một đơn trong danh sách bằng dữ liệu mới nhất BE trả về
  const replaceOrder = (updated) => {
    setOrders((current) => {
      const next = current.map((order) =>
        order.orderCode === updated.orderCode ? mapOrder(updated) : order
      );
      saveCache(next);
      return next;
    });
  };

  // Hủy đơn trên BE (hoàn kho), dùng luôn kết quả BE trả về thay vì tự đoán trạng thái
  const handleCancel = async (orderCode, reason) => {
    const updated = await orderService.cancelOrder(orderCode, reason);
    replaceOrder(updated);
    setBanner({ type: "success", text: `Hủy đơn hàng ${orderCode} thành công.` });
  };

  // Thanh toán lại đơn đang chờ: BE vô hiệu link cũ, tạo link mới
  const handlePay = async (orderCode) => {
    try {
      await paymentService.redirectToGateway(orderCode);
    } catch (err) {
      setBanner({ type: "error", text: err.message || "Không tạo được liên kết thanh toán." });
    }
  };

  const reloadOrders = async () => {
    try {
      const data = await userService.getMyOrders();
      const mapped = data.map(mapOrder);
      setOrders(mapped);
      saveCache(mapped);
    } catch (err) {
      console.warn("Không thể tải lại danh sách đơn hàng:", err);
    }
  };

  const handleMarkItemReviewed = (orderItemId, message, shouldReload = false) => {
    setOrders((current) => {
      const next = current.map((order) => ({
        ...order,
        products: order.products.map((p) =>
          p.id === orderItemId ? { ...p, reviewed: true } : p
        ),
      }));
      saveCache(next);
      return next;
    });
    if (message) {
      setBanner({ type: "success", text: message });
    }
    if (shouldReload) {
      reloadOrders();
    }
  };

  return (
    <div className="orders-page" data-node-id="12:747">
      <Navbar quantity={cartCount} />

      <main>
        <OrdersHeader />

        <section className="orders-layout" data-node-id="12:778">
          <OrdersSidebar />
          <div className="orders-main">
            {banner && (
              <div
                role="status"
                style={{
                  margin: "0 0 20px",
                  padding: "14px 18px",
                  borderRadius: 8,
                  ...BANNER_STYLES[banner.type],
                }}
              >
                {banner.text}
              </div>
            )}
            <div className="orders-toolbar">
              <div className="orders-heading-row">
                <h2>Danh sách đơn hàng</h2>
                <span>Hiển thị {filteredOrders.length} / {orders.length} đơn hàng</span>
              </div>
              <div className="orders-filters" aria-label="Lọc đơn hàng">
                {ORDER_FILTERS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={filter === option.id ? "is-active" : ""}
                    aria-pressed={filter === option.id}
                    onClick={() => setFilter(option.id)}
                  >
                    {option.label}
                    <span>
                      {option.id === "all"
                        ? orders.length
                        : orders.filter((order) => order.status === option.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#a1a1aa" }}>
                Đang tải danh sách đơn hàng...
              </div>
            ) : (
              <OrdersList
                orders={filteredOrders}
                onCancel={handleCancel}
                onPay={handlePay}
                onReviewSuccess={(orderItemId, msg) =>
                  handleMarkItemReviewed(orderItemId, msg || "Đánh giá sản phẩm thành công.", true)
                }
                onAlreadyReviewed={(orderItemId, msg) =>
                  handleMarkItemReviewed(orderItemId, msg, false)
                }
                onReloadOrders={reloadOrders}
              />
            )}
          </div>
        </section>
      </main>

      <CartFooter />
    </div>
  );
}

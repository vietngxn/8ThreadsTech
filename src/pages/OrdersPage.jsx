import { useState, useEffect } from "react";
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
import { userService } from "../services/userService";

const statusOptions = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "shipping", label: "Đang giao" },
  { id: "delivered", label: "Đã giao" },
  { id: "cancelled", label: "Đã hủy" },
];

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
        <a href="/ho-so"><IconUser /><span>Hồ sơ cá nhân</span></a>
        <a className="is-active" href="/don-hang" aria-current="page">
          <IconPackage /><span>Đơn hàng của tôi</span><IconChevronRight />
        </a>
        <a href="/so-dia-chi"><IconMapPin /><span>Sổ địa chỉ</span></a>
        <a href="/doi-mat-khau"><IconLock /><span>Đổi mật khẩu</span></a>
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

function getCachedOrders() {
  try {
    const raw = localStorage.getItem(CACHE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState(getCachedOrders);
  const [loading, setLoading] = useState(() => getCachedOrders().length === 0);

  useEffect(() => {
    userService.getMyOrders()
      .then((data) => {
        const mapped = data.map((o) => ({
          id: `#${o.orderCode}`,
          orderCode: o.orderCode,
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("vi-VN") : "",
          sortDate: o.createdAt,
          status: o.status?.toLowerCase() || "pending",
          statusLabel: o.statusLabel || o.status,
          payment: `${o.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"} · ${o.paymentMethod || "COD"}`,
          products: o.items && o.items.length > 0 ? o.items.map((item) => ({
            name: item.productName,
            variant: item.selectedOptions || "Bàn phím cơ cao cấp",
            price: Number(item.unitPrice),
            quantity: item.quantity,
            image: item.productImageUrl || thread75Image,
          })) : [
            { name: "Đơn hàng #" + o.orderCode, variant: "Tiêu chuẩn", price: Number(o.totalAmount), image: thread75Image }
          ],
          total: Number(o.totalAmount || 0),
          deliveryAddress: o.deliveryAddress,
          delivery: o.deliveryAddress || "Giao tiêu chuẩn · Miễn phí vận chuyển",
        }));
        setOrders(mapped);
        localStorage.setItem(CACHE_ORDERS_KEY, JSON.stringify(mapped));
      })
      .catch((err) => {
        console.warn("Không thể tải danh sách đơn hàng:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter(
    (o) => filter === "all" || o.status === filter
  );

  const handleCancel = (id) => {
    alert(`Hủy đơn ${id} - tính năng chưa được kết nối.`);
  };

  return (
    <div className="orders-page" data-node-id="12:747">
      <Navbar quantity={0} />

      <main>
        <OrdersHeader />

        <section className="orders-layout" data-node-id="12:778">
          <OrdersSidebar />
          <div className="orders-main">
            <div className="orders-toolbar">
              <div className="orders-heading-row">
                <h2>Danh sách đơn hàng</h2>
                <span>Hiển thị {filteredOrders.length} / {orders.length} đơn hàng</span>
              </div>
              <div className="orders-filters" aria-label="Lọc đơn hàng">
                {statusOptions.map((option) => (
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
              <OrdersList orders={filteredOrders} onCancel={handleCancel} />
            )}
          </div>
        </section>
      </main>

      <CartFooter />
    </div>
  );
}

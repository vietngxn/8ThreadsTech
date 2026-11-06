import { useState } from "react";
import Navbar from "../components/common/Navbar";
import CartFooter from "../components/cart/CartFooter";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersList from "../components/orders/OrdersList";
import thread75Image from "../assets/list-thread-75.png";
import thread65Image from "../assets/list-thread-65.png";
import thread98Image from "../assets/list-thread-98.png";
import {
  IconChevronRight,
  IconLock,
  IconLogout,
  IconMapPin,
  IconPackage,
  IconUser,
} from "@tabler/icons-react";

const initialOrders = [
  {
    id: "#8TT-261027-0186",
    date: "27/10/2026",
    sortDate: "2026-10-27",
    status: "pending",
    statusLabel: "Đã tiếp nhận · Chờ xác nhận",
    payment: "Chưa thanh toán · COD",
    products: [
      { name: "THREAD 75", variant: "Bạc ánh trăng / Linear Red Switch", price: 2490000, image: thread75Image },
      { name: "THREAD 65", variant: "Đen nguyên bản / Linear Switch", price: 1890000, image: thread65Image },
      { name: "THREAD 98", variant: "Trắng sương / Tactile Brown Switch", price: 2190000, image: thread98Image },
    ],
    total: 6570000,
    delivery: "Giao tiêu chuẩn · Miễn phí vận chuyển",
  },
  {
    id: "#8TT-261024-0152",
    date: "24/10/2026",
    sortDate: "2026-10-24",
    status: "shipping",
    statusLabel: "Đang giao hàng",
    payment: "Đã thanh toán · VNPAY",
    products: [{ name: "THREAD 65", variant: "Đen nguyên bản / Linear Switch", price: 1890000, image: thread65Image }],
    total: 1890000,
    delivery: "Dự kiến nhận: 28/10/2026 · Miễn phí vận chuyển",
  },
  {
    id: "#8TT-261010-0089",
    date: "10/10/2026",
    sortDate: "2026-10-10",
    status: "delivered",
    statusLabel: "Đã giao hàng",
    payment: "Đã thanh toán · COD",
    products: [{ name: "THREAD 98", variant: "Trắng sương / Tactile Brown Switch", price: 2190000, image: thread98Image }],
    total: 2190000,
    delivery: "Đã nhận: 13/10/2026 · Miễn phí vận chuyển",
    review: true,
  },
  {
    id: "#8TT-260928-0041",
    date: "28/09/2026",
    sortDate: "2026-09-28",
    status: "cancelled",
    statusLabel: "Đã hủy",
    payment: "Chưa thanh toán · COD",
    products: [{ name: "THREAD 75", variant: "Bạc ánh trăng / Linear Red Switch", price: 2490000, image: thread75Image }],
    total: 2490000,
    delivery: "Đã hủy theo yêu cầu · Không phát sinh thanh toán",
  },
];

const statusOptions = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "shipping", label: "Đang giao" },
  { id: "delivered", label: "Đã giao" },
  { id: "cancelled", label: "Đã hủy" },
];

function OrdersSidebar() {
  return (
    <aside className="orders-sidebar">
      <div className="orders-identity">
        <div className="orders-avatar" aria-hidden="true">MA</div>
        <div className="orders-identity-copy">
          <strong>Nguyễn Minh An</strong>
          <span>minhan@example.com</span>
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
        <a href="/dang-nhap"><IconLogout /><span>Đăng xuất</span></a>
      </nav>
      <div className="orders-sidebar-rule orders-help-rule" />
      <div className="orders-help">
        <p>Cần hỗ trợ về tài khoản của bạn?</p>
        <a href="mailto:hello@8threadtech.vn">NHẮN TIN CHO 8THREADS</a>
      </div>
    </aside>
  );
}

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");

  const filteredOrders = initialOrders.filter(
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
                <span>Hiển thị {filteredOrders.length} / {initialOrders.length} đơn hàng</span>
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
                        ? initialOrders.length
                        : initialOrders.filter((order) => order.status === option.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <OrdersList orders={filteredOrders} onCancel={handleCancel} />
          </div>
        </section>
      </main>

      <CartFooter />
    </div>
  );
}
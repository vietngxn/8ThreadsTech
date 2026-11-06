import { useState, useMemo } from "react";
import { IconChevronRight } from "@tabler/icons-react";

const initialOrders = [
  {
    id: "#8TT-261027-0186",
    date: "27/10/2026",
    sortDate: "2026-10-27",
    status: "pending",
    statusLabel: "Đã tiếp nhận · Chờ xác nhận",
    payment: "Chưa thanh toán · COD",
    products: [
      { name: "THREAD 75", variant: "Bạc ánh trăng / Linear Red Switch", price: 2490000, image: "/assets/list-thread-75.png" },
      { name: "THREAD 65", variant: "Đen nguyên bản / Linear Switch", price: 1890000, image: "/assets/list-thread-65.png" },
      { name: "THREAD 98", variant: "Trắng sương / Tactile Brown Switch", price: 2190000, image: "/assets/list-thread-98.png" },
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
    products: [{ name: "THREAD 65", variant: "Đen nguyên bản / Linear Switch", price: 1890000, image: "/assets/list-thread-65.png" }],
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
    products: [{ name: "THREAD 98", variant: "Trắng sương / Tactile Brown Switch", price: 2190000, image: "/assets/list-thread-98.png" }],
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
    products: [{ name: "THREAD 75", variant: "Bạc ánh trăng / Linear Red Switch", price: 2490000, image: "/assets/list-thread-75.png" }],
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

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;

export default function OrdersHeader() {
  const [filter, setFilter] = useState("all");

  const filteredOrders = useMemo(
    () => initialOrders.filter((o) => filter === "all" || o.status === filter),
    [filter]
  );

  return (
    <>
      <section className="orders-intro" data-node-id="12:760">
        <div className="cart-breadcrumb" data-node-id="12:761">
          <a href="/">Trang chủ</a>
          <IconChevronRight />
          <a href="/ho-so">Tài khoản</a>
          <IconChevronRight />
          <span>Đơn hàng của tôi</span>
        </div>
        <div className="orders-heading" data-node-id="12:765">
          <div className="orders-signature" data-node-id="12:766">
            <i />8THREADS - "FEEL" NHỊP GÕ CỦA BẠN.
          </div>
          <h1 data-node-id="12:768">ĐƠN HÀNG CỦA TÔI</h1>
        </div>
        <div className="orders-divider" />
      </section>

      <div className="orders-toolbar" data-node-id="12:772">
        <div className="orders-filter" data-node-id="12:773">
          <label htmlFor="order-filter" className="sr-only">Lọc đơn hàng theo trạng thái</label>
          <select id="order-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            {statusOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <p data-node-id="12:776">Hiển thị {filteredOrders.length} / {initialOrders.length} đơn hàng</p>
      </div>
    </>
  );
}
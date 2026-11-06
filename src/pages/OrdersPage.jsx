import { useState } from "react";
import CartHeader from "../components/cart/CartHeader";
import CartFooter from "../components/cart/CartFooter";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersList from "../components/orders/OrdersList";

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
      <CartHeader quantity={0} />
      
      <main>
        <OrdersHeader />
        
        <section className="orders-content" data-node-id="12:778">
          <OrdersList
            orders={filteredOrders}
            onCancel={handleCancel}
          />
        </section>
      </main>
      
      <CartFooter />
    </div>
  );
}
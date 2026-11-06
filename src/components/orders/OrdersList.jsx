import { useState } from "react";
import { IconArrowUpRight, IconStar } from "@tabler/icons-react";

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

function OrderCard({ order, onCancel }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSent, setReviewSent] = useState(false);

  return (
    <article className={`order-card order-card--${order.status}`} data-node-id={order.nodeId}>
      <header className="order-card-header" data-node-id="12:799">
        <div className="order-number">
          <strong data-node-id="12:801">{order.id}</strong>
          <span data-node-id="12:802">Ngày đặt: {order.date}</span>
        </div>
        <div className="order-status-block">
          <span className="order-overline">TRẠNG THÁI ĐƠN HÀNG</span>
          <span className={`order-status order-status--${order.status}`}>{order.statusLabel}</span>
        </div>
        <div className="order-payment">
          <span className="order-overline">THANH TOÁN</span>
          <span>{order.payment}</span>
        </div>
      </header>

      <div className="order-products">
        {order.products.map((product) => (
          <div className="order-product" key={`${order.id}-${product.name}`} data-node-id="12:811">
            <div className="order-product-image"><img src={product.image} alt={product.name} /></div>
            <div className="order-product-info">
              <strong>{product.name}</strong>
              <span>{product.variant}</span>
            </div>
            <span className="order-product-quantity">× 1</span>
            <strong className="order-product-price">{formatPrice(product.price)}</strong>
          </div>
        ))}
      </div>

      <footer className="order-card-footer">
        <div className="order-total">
          <div><span>{order.products.length} sản phẩm · Tổng tiền</span><strong>{formatPrice(order.total)}</strong></div>
          <small>{order.delivery}</small>
        </div>
        <div className="order-actions">
          {order.status === "pending" && !confirmCancel && (
            <button className="order-button order-button--secondary" onClick={() => setConfirmCancel(true)}>HỦY ĐƠN HÀNG</button>
          )}
          {order.status === "pending" && confirmCancel && (
            <div className="order-cancel-confirm" role="group" aria-label="Xác nhận hủy đơn hàng">
              <span>Hủy đơn này?</span>
              <button onClick={() => onCancel(order.id)}>Xác nhận</button>
              <button onClick={() => setConfirmCancel(false)}>Giữ đơn</button>
            </div>
          )}
          {order.id === initialOrders[0].id ? (
            <a className="order-button order-button--secondary" href="/don-hang/chi-tiet">XEM CHI TIẾT</a>
          ) : (
            <button className="order-button order-button--secondary" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((open) => !open)}>
              {detailsOpen ? "ĐÓNG CHI TIẾT" : "XEM CHI TIẾT"}
            </button>
          )}
          {order.status === "shipping" && <button className="order-button order-button--primary" onClick={() => setDetailsOpen(true)}>THEO DÕI ĐƠN <IconArrowUpRight /></button>}
          {(order.status === "delivered" || order.status === "cancelled") && <a className="order-button order-button--primary" href="/">MUA LẠI <IconArrowUpRight /></a>}
        </div>
      </footer>

      {detailsOpen && (
        <div className="order-details" data-node-id="12:836">
          <div><span>MÃ ĐƠN HÀNG</span><strong>{order.id}</strong></div>
          <div><span>ĐỊA CHỈ GIAO HÀNG</span><strong>Nguyễn Minh An · 123 Đường Số 8, TP. Hồ Chí Minh</strong></div>
          <div><span>PHƯƠNG THỨC THANH TOÁN</span><strong>{order.payment}</strong></div>
        </div>
      )}

      {order.review && (
        <section className="order-review" aria-labelledby={`review-${order.id}`} data-node-id="40:121">
          <div className="order-review-heading">
            <h3 id={`review-${order.id}`}>Đánh giá sản phẩm</h3>
            <span>ĐÁNH GIÁ SAU KHI GIAO</span>
          </div>
          <p className="order-review-note">Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã được giao. Đánh giá này dành riêng cho sản phẩm {order.products[0].name} trong đơn {order.id}.</p>
          <div className="review-product">
            <img src={order.products[0].image} alt={order.products[0].name} />
            <div>
              <strong>{order.products[0].name}</strong>
              <span>{order.products[0].variant}</span>
            </div>
          </div>
          <div className="review-rating">
            <span>Đánh giá của bạn</span>
            <div className="review-stars" role="radiogroup" aria-label="Chọn số sao">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className={star <= rating ? "filled" : ""} onClick={() => setRating(star)} aria-label={`${star} sao`}><IconStar size={20} aria-hidden="true" /></button>
              ))}
            </div>
          </div>
          <textarea className="review-comment" placeholder="Chia sẻ trải nghiệm của bạn..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          {reviewSent ? (
            <p className="review-thanks">Cảm ơn bạn đã đánh giá!</p>
          ) : (
            <button className="review-submit" onClick={() => setReviewSent(true)}>GỬI ĐÁNH GIÁ</button>
          )}
        </section>
      )}
    </article>
  );
}

export default function OrdersList({ orders, onCancel }) {
  return (
    <div className="orders-list" data-node-id="12:788">
      {orders.map((order, index) => (
        <OrderCard key={order.id} order={{...order, nodeId: `12:${790 + index * 10}`}} onCancel={onCancel} />
      ))}
      {orders.length === 0 && <p className="orders-empty">Không có đơn hàng nào phù hợp.</p>}
    </div>
  );
}
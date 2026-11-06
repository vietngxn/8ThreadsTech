import { useMemo, useState } from "react";
import {
  IconArrowUpRight,
  IconChevronRight,
  IconLock,
  IconLogout,
  IconMapPin,
  IconPackage,
  IconSearch,
  IconShoppingBag,
  IconStar,
  IconUser,
} from "@tabler/icons-react";
import logo from "../assets/thread-logo.png";
import thread75 from "../assets/list-thread-75.png";
import thread65 from "../assets/list-thread-65.png";
import thread98 from "../assets/list-thread-98.png";
import { CartFooter } from "./CartPage.jsx";
import "./OrdersPage.css";

const initialOrders = [
  {
    id: "#8TT-261027-0186",
    date: "27/10/2026",
    sortDate: "2026-10-27",
    status: "pending",
    statusLabel: "Đã tiếp nhận · Chờ xác nhận",
    payment: "Chưa thanh toán · COD",
    products: [
      { name: "THREAD 75", variant: "Bạc ánh trăng / Linear Red Switch", price: 2490000, image: thread75 },
      { name: "THREAD 65", variant: "Đen nguyên bản / Linear Switch", price: 1890000, image: thread65 },
      { name: "THREAD 98", variant: "Trắng sương / Tactile Brown Switch", price: 2190000, image: thread98 },
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
    products: [{ name: "THREAD 65", variant: "Đen nguyên bản / Linear Switch", price: 1890000, image: thread65 }],
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
    products: [{ name: "THREAD 98", variant: "Trắng sương / Tactile Brown Switch", price: 2190000, image: thread98 }],
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
    products: [{ name: "THREAD 75", variant: "Bạc ánh trăng / Linear Red Switch", price: 2490000, image: thread75 }],
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
          {order.id === initialOrders[0].id ? <a className="order-button order-button--secondary" href="/don-hang/chi-tiet">XEM CHI TIẾT</a> : <button className="order-button order-button--secondary" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((open) => !open)}>
            {detailsOpen ? "ĐÓNG CHI TIẾT" : "XEM CHI TIẾT"}
          </button>}
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
            <div className="review-product-image"><img src={order.products[0].image} alt={order.products[0].name} /></div>
            <div><strong>{order.products[0].name}</strong><span>{order.products[0].variant}</span></div>
            <span>× 1</span>
          </div>
          <fieldset className="review-rating">
            <legend>ĐÁNH GIÁ SAO</legend>
            <div className="review-stars" role="group" aria-label="Chọn số sao">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" aria-label={`${star} sao`} aria-pressed={rating === star} onClick={() => setRating(star)}>
                  <IconStar className={star <= rating ? "is-active" : ""} />
                </button>
              ))}
            </div>
            <span>{rating} sao · {rating === 5 ? "Đánh giá cao nhất" : "Cảm ơn đánh giá của bạn"}</span>
          </fieldset>
          <label className="review-comment">BÌNH LUẬN<textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Viết cảm nhận của bạn về sản phẩm này..." /></label>
          {reviewSent ? <p className="review-success" role="status">Cảm ơn bạn đã gửi đánh giá.</p> : <button className="order-button order-button--primary review-submit" onClick={() => setReviewSent(true)}>GỬI ĐÁNH GIÁ</button>}
        </section>
      )}
    </article>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeStatus, setActiveStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const counts = useMemo(() => statusOptions.reduce((result, option) => {
    result[option.id] = option.id === "all" ? orders.length : orders.filter((order) => order.status === option.id).length;
    return result;
  }, {}), [orders]);

  const visibleOrders = useMemo(() => orders
    .filter((order) => activeStatus === "all" || order.status === activeStatus)
    .filter((order) => `${order.id} ${order.products.map((product) => product.name).join(" ")}`.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi")))
    .sort((a, b) => sortOrder === "newest" ? b.sortDate.localeCompare(a.sortDate) : a.sortDate.localeCompare(b.sortDate)), [orders, activeStatus, query, sortOrder]);

  const cancelOrder = (orderId) => setOrders((current) => current.map((order) => order.id === orderId
    ? { ...order, status: "cancelled", statusLabel: "Đã hủy", delivery: "Đã hủy theo yêu cầu · Không phát sinh thanh toán" }
    : order));

  return (
    <div className="orders-page" data-node-id="12:704">
      <header className="cart-header orders-header" data-node-id="12:705">
        <a className="cart-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="12:706"><img src={logo} alt="" /><span>8ThreadTech</span></a>
        <nav className="cart-nav" aria-label="Danh mục" data-node-id="12:709"><a href="/">BÀN PHÍM</a><a href="/">KEYCAP</a><a href="/">PHỤ KIỆN</a><a href="/">VỀ 8THREADS TEAM</a></nav>
        <div className="cart-tools" data-node-id="16:1266"><button aria-label="Tìm kiếm"><IconSearch /></button><a className="cart-bag" href="/gio-hang" aria-label="Giỏ hàng"><IconShoppingBag /><span>0</span></a><a href="/ho-so" aria-label="Tài khoản"><IconUser /></a></div>
      </header>

      <main>
        <section className="orders-intro" data-node-id="12:723">
          <div className="cart-breadcrumb" data-node-id="12:724"><a href="/">Trang chủ</a><IconChevronRight /><a href="/ho-so">Tài khoản</a><IconChevronRight /><span>Đơn hàng của tôi</span></div>
          <div className="orders-title" data-node-id="12:730"><div className="orders-signature"><i />8THREADS - “FEEL” THEO TỪNG NHỊP GÕ CỦA BẠN.</div><h1>ĐƠN HÀNG CỦA TÔI</h1></div>
          <div className="orders-intro-divider" />
        </section>

        <section className="orders-layout" data-node-id="12:736">
          <aside className="orders-sidebar" data-node-id="12:737">
            <div className="orders-identity">
              <div className="orders-avatar">MA</div>
              <div className="orders-identity-copy"><strong>Nguyễn Minh An</strong><span>minhan@example.com</span></div>
              <small>TÀI KHOẢN NGƯỜI DÙNG</small>
            </div>
            <div className="orders-sidebar-rule" />
            <nav className="orders-account-menu" aria-label="Điều hướng tài khoản">
              <a href="/ho-so"><IconUser /><span>Hồ sơ cá nhân</span></a>
              <a className="is-active" href="/don-hang" aria-current="page"><IconPackage /><span>Đơn hàng của tôi</span><IconChevronRight /></a>
              <a href="/so-dia-chi"><IconMapPin /><span>Sổ địa chỉ</span></a>
              <a href="/ho-so"><IconLock /><span>Đổi mật khẩu</span></a>
              <a href="/dang-nhap"><IconLogout /><span>Đăng xuất</span></a>
            </nav>
            <div className="orders-sidebar-rule orders-help-rule" />
            <div className="orders-help"><p>Cần hỗ trợ về tài khoản của bạn?</p><a href="mailto:hello@8threadtech.vn">NHẮN TIN CHO 8THREADS <IconArrowUpRight /></a></div>
          </aside>

          <div className="orders-main" data-node-id="12:769">
            <div className="orders-toolbar" data-node-id="12:770">
              <div className="orders-heading-row"><h2>LỊCH SỬ ĐƠN HÀNG</h2><span>{orders.length} đơn hàng</span></div>
              <div className="orders-search-sort">
                <label className="orders-search"><IconSearch /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo mã đơn hàng hoặc tên sản phẩm" aria-label="Tìm theo mã đơn hàng hoặc tên sản phẩm" /></label>
                <label className="orders-sort"><span className="sr-only">Sắp xếp đơn hàng</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="newest">Mới nhất trước</option><option value="oldest">Cũ nhất trước</option></select></label>
              </div>
              <div className="orders-filters" role="tablist" aria-label="Lọc theo trạng thái">
                {statusOptions.map((option) => (
                  <button key={option.id} type="button" role="tab" aria-selected={activeStatus === option.id} className={activeStatus === option.id ? "is-active" : ""} onClick={() => setActiveStatus(option.id)}>
                    {option.label}<span>{counts[option.id]}</span>
                  </button>
                ))}
              </div>
            </div>

            {visibleOrders.length ? <div className="orders-list" data-node-id="12:797">
              {visibleOrders.map((order) => <OrderCard key={order.id} order={order} onCancel={cancelOrder} />)}
              <div className="orders-list-end"><span>Hiển thị {visibleOrders.length} / {orders.length} đơn hàng</span><span>{visibleOrders.length === orders.length ? "Bạn đã xem tất cả đơn hàng." : ""}</span></div>
            </div> : <div className="orders-empty"><IconPackage /><strong>Không tìm thấy đơn hàng</strong><span>Thử thay đổi từ khóa hoặc bộ lọc trạng thái.</span></div>}
          </div>
        </section>
      </main>
      <CartFooter />
    </div>
  );
}

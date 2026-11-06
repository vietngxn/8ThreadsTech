import {
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconChevronRight,
  IconCreditCard,
  IconHeadphones,
  IconSearch,
  IconShoppingBag,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import logo from "../assets/thread-logo.png";
import thread75 from "../assets/list-thread-75.png";
import thread65 from "../assets/list-thread-65.png";
import thread98 from "../assets/list-thread-98.png";
import { CartFooter } from "./CartPage.jsx";
import "./OrderCompletePage.css";

const items = [
  { name: "THREAD 75", color: "Bạc ánh trăng", switch: "Linear Red Switch", price: 2490000, oldPrice: 2790000, image: thread75 },
  { name: "THREAD 65", color: "Đen nguyên bản", switch: "Linear Switch", price: 1890000, image: thread65 },
  { name: "THREAD 98", color: "Trắng sương", switch: "Tactile Brown Switch", price: 2190000, oldPrice: 2490000, image: thread98 },
];

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;
const total = items.reduce((sum, item) => sum + item.price, 0);
const saved = items.reduce((sum, item) => sum + (item.oldPrice ?? item.price) - item.price, 0);

function SectionHeading({ number, children }) {
  return <div className="order-section-heading"><span>{number}</span><h2>{children}</h2></div>;
}

function OrderCompleteHeader() {
  return (
    <>
      <header className="cart-header" data-node-id="5:467">
        <a className="cart-brand" href="/" aria-label="8ThreadTech trang chủ"><img src={logo} alt="" /><span>8ThreadTech</span></a>
        <nav className="cart-nav" aria-label="Danh mục"><a className="active" href="/">BÀN PHÍM</a><a href="/">KEYCAP</a><a href="/">PHỤ KIỆN</a><a href="/">VỀ 8THREADS TEAM</a></nav>
        <div className="cart-tools"><button aria-label="Tìm kiếm"><IconSearch /></button><a className="cart-bag" href="/gio-hang" aria-label="Giỏ hàng"><IconShoppingBag /><span>3</span></a><a href="/dang-nhap" aria-label="Tài khoản"><IconUser /></a></div>
      </header>
      <section className="cart-intro order-intro" data-node-id="5:493">
        <div className="cart-breadcrumb"><a href="/">Trang chủ</a><IconChevronRight /><a href="/gio-hang">Giỏ hàng</a><IconChevronRight /><a href="/thanh-toan">Thanh toán</a><IconChevronRight /><span>Hoàn tất</span></div>
        <div className="cart-intro-row">
          <div className="cart-heading"><div className="cart-signature"><i />8THREADS - “FEEL” THEO TỪNG NHỊP GÕ CỦA BẠN.</div><div className="cart-title-row"><h1>HOÀN TẤT</h1></div></div>
          <div className="cart-steps" aria-label="Tiến trình đặt hàng"><span>01&nbsp; GIỎ HÀNG</span><i className="checkout-step-done" /><span>02&nbsp; THANH TOÁN</span><i className="checkout-step-done" /><span className="current">03&nbsp; HOÀN TẤT</span></div>
        </div>
        <div className="cart-divider" />
      </section>
    </>
  );
}

function OrderSummary() {
  return (
    <aside className="order-summary-column">
      <div className="order-summary-card" id="don-hang" data-node-id="5:600">
        <header className="order-summary-heading"><h2>ĐƠN HÀNG CỦA BẠN</h2><span>3 sản phẩm / 3 món</span></header>
        <div className="order-products">
          {items.map((item, index) => <article className="order-product" key={item.name} data-node-id={["5:605", "5:617", "5:628"][index]}>
            <div className="order-product-image"><img src={item.image} alt={item.name} /></div>
            <div className="order-product-info"><div className="order-product-title"><h3>{item.name}</h3><span>× 1</span></div><p>{item.color}</p><small>{item.switch}</small><div className="order-product-price"><strong>{formatPrice(item.price)}</strong>{item.oldPrice && <del>{formatPrice(item.oldPrice)}</del>}</div></div>
          </article>)}
        </div>
        <div className="order-costs"><div><span>Tạm tính (3 sản phẩm)</span><strong>{formatPrice(total)}</strong></div><div><span>Giảm giá</span><strong>0 ₫</strong></div><div><span>Phí vận chuyển</span><strong className="order-free">Miễn phí</strong></div></div>
        <div className="order-summary-rule" />
        <div className="order-grand-total"><div><strong>TỔNG CỘNG</strong><b>{formatPrice(total)}</b></div><small>Đã bao gồm VAT</small><p>Bạn đã tiết kiệm {formatPrice(saved)} từ giá gốc.</p></div>
        <div className="order-payment-note"><strong>CHƯA THANH TOÁN · COD</strong><p>Thanh toán {formatPrice(total)} khi nhận hàng. Không cần chuyển khoản trước.</p></div>
      </div>
      <div className="order-help"><IconHeadphones aria-hidden="true" /><div><span>Cần hỗ trợ về đơn hàng của bạn?</span><a href="mailto:hello@8threadtech.vn">NHẮN TIN CHO 8THREADS <IconArrowUpRight /></a></div></div>
    </aside>
  );
}

export default function OrderCompletePage() {
  return (
    <div className="order-complete-page" data-node-id="5:465">
      <OrderCompleteHeader />
      <main className="order-complete-content" data-node-id="5:522">
        <div className="order-confirmation-column">
          <section className="order-success" data-node-id="5:524">
            <div className="order-success-heading"><span className="order-success-icon"><IconCheck aria-hidden="true" /></span><div><h2>ĐẶT HÀNG THÀNH CÔNG!</h2><p>Cảm ơn bạn đã chọn 8ThreadTech. Nhịp gõ mới đang đến gần.</p></div></div>
            <div className="order-id-panel"><div><span>MÃ ĐƠN HÀNG</span><strong>#8TT-261027-0186</strong></div><span className="order-status">Đã tiếp nhận · Chờ xác nhận</span></div>
            <p className="order-payment-copy">Đơn hàng đã được ghi nhận, chưa thanh toán. Bạn sẽ thanh toán khi nhận hàng (COD). Thông tin xác nhận sẽ được gửi qua email sau khi đơn được xử lý.</p>
            <div className="order-actions"><a className="order-primary-action" href="/"><span>TIẾP TỤC MUA SẮM</span><IconArrowRight /></a><a className="order-secondary-action" href="#don-hang"><span>XEM ĐƠN HÀNG</span><IconArrowUpRight /></a></div>
          </section>
          <section className="order-next-steps"><SectionHeading number="01">TIẾP THEO LÀ GÌ?</SectionHeading><div className="order-step-grid"><article><span>01 /</span><h3>Xác nhận đơn hàng</h3><p>8Threads sẽ liên hệ để xác nhận thông tin và chuẩn bị sản phẩm.</p></article><article><span>02 /</span><h3>Đóng gói &amp; giao hàng</h3><p>Mã vận đơn sẽ được cập nhật khi đơn hàng bàn giao cho giao vận.</p></article><article><span>03 /</span><h3>Nhận hàng &amp; thanh toán</h3><p>Nhận bộ phím mới và thanh toán {formatPrice(total)} cho đơn vị vận chuyển.</p></article></div></section>
          <section className="order-delivery"><SectionHeading number="02">THÔNG TIN NHẬN HÀNG</SectionHeading><div className="order-delivery-details"><div><span>THÔNG TIN ĐẶT HÀNG</span><strong>Nguyễn Minh An</strong><p>0987 654 123</p><p>minhan@example.com</p></div><div><strong>Địa chỉ giao hàng</strong><p>123 Đường Số 8, Phường Thủ Đức, TP. Hồ Chí Minh</p></div></div></section>
          <section className="order-shipping"><SectionHeading number="03">GIAO HÀNG &amp; THANH TOÁN</SectionHeading><div className="order-method-grid"><article><div><IconTruck /><strong>Giao hàng tiêu chuẩn</strong><span>Miễn phí</span></div><p>Dự kiến 2–5 ngày làm việc kể từ khi xác nhận đơn hàng.</p></article><article><div><IconCreditCard /><strong>Thanh toán khi nhận hàng (COD)</strong></div><p>Thanh toán {formatPrice(total)} cho đơn vị vận chuyển khi nhận sản phẩm.</p></article></div></section>
        </div>
        <OrderSummary />
      </main>
      <CartFooter />
    </div>
  );
}

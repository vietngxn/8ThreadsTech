import { useState } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconTruck,
  IconChevronRight,
  IconCreditCard,
  IconQrcode,
  IconSearch,
  IconShoppingBag,
  IconUser,
} from "@tabler/icons-react";
import logo from "../assets/thread-logo.png";
import thread75 from "../assets/list-thread-75.png";
import thread65 from "../assets/list-thread-65.png";
import thread98 from "../assets/list-thread-98.png";
import { CartFooter } from "./CartPage.jsx";
import "./CheckoutPage.css";

const items = [
  { name: "THREAD 75", color: "Bạc ánh trăng", switch: "Linear Red Switch", price: 2490000, oldPrice: 2790000, image: thread75 },
  { name: "THREAD 65", color: "Đen nguyên bản", switch: "Linear Switch", price: 1890000, image: thread65 },
  { name: "THREAD 98", color: "Trắng sương", switch: "Tactile Brown Switch", price: 2190000, oldPrice: 2490000, image: thread98 },
];

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;

const paymentMethods = [
  { id: "cod", title: "Thanh toán khi nhận hàng (COD)", description: "Thanh toán cho đơn vị vận chuyển khi nhận sản phẩm.", icon: IconTruck },
  { id: "vnpay", title: "Chuyển khoản ngân hàng / VNPAY", description: "Thanh toán an toàn qua cổng thanh toán trực tuyến.", icon: IconQrcode },
  { id: "momo", title: "Ví điện tử / MOMO", description: "Thanh toán an toàn qua cổng thanh toán trực tuyến.", icon: IconCreditCard },
];

function CheckoutField({ label, children, className = "" }) {
  return <label className={`checkout-field ${className}`}><span>{label}</span>{children}</label>;
}

function CheckoutSection({ number, title, children, note }) {
  return (
    <section className="checkout-section">
      <div className="checkout-section-heading">
        <span className="checkout-section-number">{number}</span>
        <h2>{title}</h2>
        {note && <span className="checkout-section-note">{note}</span>}
      </div>
      {children}
    </section>
  );
}

function ChoiceCard({ name, value, selected, onChange, title, description, icon: Icon, price }) {
  return (
    <label className={`checkout-choice${selected ? " is-selected" : ""}`}>
      <input type="radio" name={name} value={value} checked={selected} onChange={onChange} />
      <span className="checkout-radio" aria-hidden="true" />
      <span className="checkout-choice-copy"><strong>{title}</strong><span>{description}</span></span>
      {Icon && <Icon className="checkout-choice-icon" aria-hidden="true" />}
      {price && <span className={`checkout-choice-price${selected ? " is-selected" : ""}`}>{price}</span>}
    </label>
  );
}

export default function CheckoutPage() {
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shippingFee = shipping === "express" ? 35000 : 0;
  const total = subtotal + shippingFee;

  const submitOrder = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="checkout-page" data-node-id="3:58">
      <header className="cart-header" data-node-id="3:59">
        <a className="cart-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="3:60"><img src={logo} alt="" data-node-id="3:61" /><span data-node-id="3:62">8ThreadTech</span></a>
        <nav className="cart-nav" aria-label="Danh mục" data-node-id="3:63"><a className="active" href="/">BÀN PHÍM</a><a href="/">KEYCAP</a><a href="/">PHỤ KIỆN</a><a href="/">VỀ 8THREADS TEAM</a></nav>
        <div className="cart-tools" data-node-id="3:76"><button aria-label="Tìm kiếm"><IconSearch /></button><a className="cart-bag" href="/gio-hang" aria-label="Giỏ hàng: 3 sản phẩm"><IconShoppingBag /><span>3</span></a><a href="/dang-nhap" aria-label="Tài khoản"><IconUser /></a></div>
      </header>

      <main>
        <section className="cart-intro checkout-intro">
          <div className="cart-breadcrumb" data-node-id="3:86"><a href="/">Trang chủ</a><IconChevronRight /><a href="/gio-hang">Giỏ hàng</a><IconChevronRight /><span>Thanh toán</span></div>
          <div className="cart-intro-row">
            <div className="cart-heading">
              <div className="cart-signature"><i />8THREADS - “FEEL” THEO TỪNG NHỊP GÕ CỦA BẠN.</div>
              <div className="cart-title-row"><h1>THANH TOÁN</h1></div>
            </div>
            <div className="cart-steps" aria-label="Tiến trình đặt hàng"><span>01&nbsp; GIỎ HÀNG</span><i className="checkout-step-done" /><span className="current">02&nbsp; THANH TOÁN</span><i /><span className="pending">03&nbsp; HOÀN TẤT</span></div>
          </div>
          <div className="cart-divider" />
        </section>

        <form id="checkout-form" className="checkout-content" onSubmit={submitOrder}>
          <div className="checkout-form-column">
            <CheckoutSection number="01" title="THÔNG TIN LIÊN HỆ" note="* Thông tin bắt buộc">
              <div className="checkout-field-grid">
                <CheckoutField label="Họ và tên *"><input name="fullName" autoComplete="name" placeholder="Nhập họ và tên người nhận" required /></CheckoutField>
                <CheckoutField label="Số điện thoại *"><input name="phone" type="tel" autoComplete="tel" placeholder="Nhập số điện thoại" required /></CheckoutField>
                <CheckoutField label="Email *" className="checkout-field-wide"><input name="email" type="email" autoComplete="email" placeholder="Nhập email để nhận xác nhận đơn hàng" required /></CheckoutField>
              </div>
            </CheckoutSection>

            <CheckoutSection number="02" title="ĐỊA CHỈ NHẬN HÀNG" note={<span className="checkout-address-note">Chọn từ sổ địa chỉ</span>}>
              <div className="checkout-field-grid">
                <CheckoutField label="Tỉnh / Thành phố *"><select name="city" defaultValue="" required><option value="" disabled>Chọn tỉnh / thành phố</option><option>Hà Nội</option><option>Thành phố Hồ Chí Minh</option><option>Đà Nẵng</option><option>Cần Thơ</option></select></CheckoutField>
                <CheckoutField label="Phường / Xã *"><select name="ward" defaultValue="" required><option value="" disabled>Chọn phường / xã</option><option>Phường 1</option><option>Phường 2</option><option>Phường 3</option><option>Phường trung tâm</option></select></CheckoutField>
                <CheckoutField label="Địa chỉ cụ thể *" className="checkout-field-wide"><input name="address" autoComplete="street-address" placeholder="Số nhà, tên đường, tòa nhà / căn hộ" required /></CheckoutField>
              </div>
            </CheckoutSection>

            <CheckoutSection number="03" title="PHƯƠNG THỨC GIAO HÀNG">
              <div className="checkout-choice-list">
                <ChoiceCard name="shipping" value="standard" selected={shipping === "standard"} onChange={() => setShipping("standard")} title="Giao hàng tiêu chuẩn" description="Dự kiến 2–5 ngày làm việc kể từ khi xác nhận đơn hàng." price="Miễn phí" />
                <ChoiceCard name="shipping" value="express" selected={shipping === "express"} onChange={() => setShipping("express")} title="Hỏa tốc" description="Trong vòng 24h. Áp dụng tại khu vực hỗ trợ." price="35.000 ₫" />
              </div>
            </CheckoutSection>

            <CheckoutSection number="04" title="PHƯƠNG THỨC THANH TOÁN">
              <div className="checkout-choice-list">
                {paymentMethods.map((method) => <ChoiceCard key={method.id} name="payment" value={method.id} selected={payment === method.id} onChange={() => setPayment(method.id)} title={method.title} description={method.description} icon={method.icon} />)}
              </div>
            </CheckoutSection>

            <CheckoutSection number="05" title="GHI CHÚ ĐƠN HÀNG" note="Không bắt buộc">
              <textarea name="note" rows="3" placeholder="Ghi chú cho 8Threads về đơn hàng hoặc hướng dẫn giao hàng..." />
            </CheckoutSection>

            <a className="checkout-back" href="/gio-hang"><IconArrowLeft /> QUAY VỀ GIỎ HÀNG</a>
          </div>

          <aside className="checkout-summary-column">
            <div className="checkout-summary-card">
              <div className="checkout-summary-heading"><h2>ĐƠN HÀNG CỦA BẠN</h2><div><span>3 sản phẩm / 3 món</span><a href="/gio-hang">Chỉnh sửa</a></div></div>
              <div className="checkout-products">
                {items.map((item, index) => <article className="checkout-product" key={item.name} data-node-id={["3:216", "3:228", "3:239"][index]}>
                  <div className="checkout-product-image"><img src={item.image} alt={item.name} /></div>
                  <div className="checkout-product-info"><div className="checkout-product-title"><h3>{item.name}</h3><span>× 1</span></div><p>{item.color}</p><small>{item.switch}</small><div className="checkout-product-price"><strong>{formatPrice(item.price)}</strong>{item.oldPrice && <del>{formatPrice(item.oldPrice)}</del>}</div></div>
                </article>)}
              </div>
              <div className="checkout-coupon">
                <label htmlFor="checkout-coupon">BẠN CÓ MÃ ƯU ĐÃI?</label>
                <div><input id="checkout-coupon" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Nhập mã ưu đãi" /><button type="button" disabled={!coupon.trim()} onClick={() => setCoupon("")}>ÁP DỤNG</button></div>
              </div>
              <div className="checkout-costs"><div><span>Tạm tính (3 sản phẩm)</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Giảm giá</span><strong>0 ₫</strong></div><div><span>Phí vận chuyển</span><strong className={shippingFee === 0 ? "checkout-free" : ""}>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</strong></div></div>
              <div className="checkout-summary-rule" />
              <div className="checkout-grand-total"><div><strong>TỔNG CỘNG</strong><b>{formatPrice(total)}</b></div><small>Đã bao gồm VAT</small><p>Bạn đã tiết kiệm 600.000 ₫ từ giá gốc.</p></div>
              <div className="checkout-submit-area">
                <label className="checkout-terms"><input type="checkbox" name="terms" required /><span>Tôi đã đọc và đồng ý với <a href="#terms">Điều khoản sử dụng</a> và <a href="#privacy">Chính sách bảo mật</a> của 8ThreadTech.</span></label>
                <button className="checkout-submit" type="submit">ĐẶT HÀNG <IconArrowRight /></button>
                <p className="checkout-payment-hint">Thanh toán {formatPrice(total)} {payment === "cod" ? "khi nhận hàng" : "qua phương thức đã chọn"}.</p>
                {submitted && <p className="checkout-success" role="status">Thông tin đơn hàng đã được kiểm tra. Hệ thống thanh toán chưa được kết nối.</p>}
              </div>
            </div>
            <div className="checkout-help"><span aria-hidden="true">◌</span><div><span>Cần hỗ trợ trước khi đặt hàng?</span><a href="mailto:hello@8threadtech.vn">NHẮN TIN CHO 8THREADS <IconArrowUpRight /></a></div></div>
          </aside>
        </form>
      </main>
      <CartFooter />
    </div>
  );
}

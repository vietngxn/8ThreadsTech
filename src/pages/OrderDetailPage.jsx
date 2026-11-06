import { useState } from "react";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCheck,
  IconChevronRight,
  IconCreditCard,
  IconHeadphones,
  IconLock,
  IconLogout,
  IconMapPin,
  IconPackage,
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
import "./OrderDetailPage.css";

const orderProducts = [
  { name: "THREAD 75", variant: "Bạc ánh trăng / Linear Red Switch", price: 2490000, oldPrice: 2790000, image: thread75 },
  { name: "THREAD 65", variant: "Đen nguyên bản / Linear Switch", price: 1890000, image: thread65 },
  { name: "THREAD 98", variant: "Trắng sương / Tactile Brown Switch", price: 2190000, oldPrice: 2490000, image: thread98 },
];

const orderSteps = ["Đã tiếp nhận", "Chờ xác nhận", "Đã xác nhận", "Đang giao hàng", "Đã giao hàng"];
const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;

function AccountSidebar() {
  return (
    <aside className="order-detail-sidebar" data-node-id="15:1274">
      <div className="order-detail-identity" data-node-id="15:1275">
        <div className="order-detail-avatar">MA</div>
        <div className="order-detail-identity-copy"><strong>Nguyễn Minh An</strong><span>minhan@example.com</span></div>
        <small>TÀI KHOẢN NGƯỜI DÙNG</small>
      </div>
      <div className="order-detail-sidebar-rule" />
      <nav className="order-detail-account-menu" aria-label="Điều hướng tài khoản">
        <a href="/ho-so"><IconUser /><span>Hồ sơ cá nhân</span></a>
        <a className="is-active" href="/don-hang" aria-current="page"><IconPackage /><span>Đơn hàng của tôi</span><IconChevronRight /></a>
        <a href="/ho-so#default-address"><IconMapPin /><span>Sổ địa chỉ</span></a>
        <a href="/ho-so"><IconLock /><span>Đổi mật khẩu</span></a>
        <a href="/dang-nhap"><IconLogout /><span>Đăng xuất</span></a>
      </nav>
      <div className="order-detail-sidebar-rule order-detail-help-rule" />
      <div className="order-detail-help"><p>Cần hỗ trợ về tài khoản của bạn?</p><a href="mailto:hello@8threadtech.vn">NHẮN TIN CHO 8THREADS <IconArrowUpRight /></a></div>
    </aside>
  );
}

function OrderProgress({ cancelled }) {
  const activeStep = cancelled ? -1 : 1;

  return (
    <div className="order-progress" aria-label={cancelled ? "Đơn hàng đã hủy" : "Đơn hàng đang chờ xác nhận"} data-node-id="15:1326">
      {orderSteps.map((step, index) => {
        const complete = index === 0 && !cancelled;
        const active = index === activeStep;
        return (
          <div className={`order-progress-step${complete ? " is-complete" : ""}${active ? " is-active" : ""}`} key={step}>
            <div className="order-progress-marker">
              {complete ? <IconCheck aria-hidden="true" /> : active ? <span className="order-progress-pulse" /> : <span>{String(index + 1).padStart(2, "0")}</span>}
            </div>
            <strong>{step}</strong>
            <small>{complete ? "27/10/2026" : active ? "Đang xử lý" : "Chưa diễn ra"}</small>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailPage() {
  const [cancelled, setCancelled] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const subtotal = orderProducts.reduce((sum, product) => sum + product.price, 0);
  const savings = orderProducts.reduce((sum, product) => sum + (product.oldPrice ?? product.price) - product.price, 0);

  return (
    <div className="order-detail-page" data-node-id="15:1238">
      <header className="cart-header order-detail-header" data-node-id="15:1239">
        <a className="cart-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="15:1240"><img src={logo} alt="" /><span>8ThreadTech</span></a>
        <nav className="cart-nav" aria-label="Danh mục" data-node-id="15:1243"><a href="/">BÀN PHÍM</a><a href="/">KEYCAP</a><a href="/">PHỤ KIỆN</a><a href="/">VỀ 8THREADS TEAM</a></nav>
        <div className="cart-tools" data-node-id="16:1276"><button aria-label="Tìm kiếm"><IconSearch /></button><a className="cart-bag" href="/gio-hang" aria-label="Giỏ hàng"><IconShoppingBag /><span>0</span></a><a href="/ho-so" aria-label="Tài khoản"><IconUser /></a></div>
      </header>

      <main>
        <section className="order-detail-intro" data-node-id="15:1254">
          <div className="cart-breadcrumb" data-node-id="15:1255"><a href="/">Trang chủ</a><IconChevronRight /><a href="/ho-so">Tài khoản</a><IconChevronRight /><a href="/don-hang">Đơn hàng của tôi</a><IconChevronRight /><span>Chi tiết đơn hàng</span></div>
          <div className="order-detail-title" data-node-id="15:1267"><div className="order-detail-signature"><i />8THREADS - “FEEL” THEO TỪNG NHỊP GÕ CỦA BẠN.</div><h1>CHI TIẾT ĐƠN HÀNG</h1></div>
          <div className="order-detail-intro-divider" />
        </section>

        <section className="order-detail-layout" data-node-id="15:1273">
          <AccountSidebar />
          <div className="order-detail-main" data-node-id="15:1306">
            <section className="order-status-section" data-node-id="15:1307">
              <a className="order-detail-back" href="/don-hang" data-node-id="15:1308"><IconArrowLeft />QUAY LẠI ĐƠN HÀNG CỦA TÔI</a>
              <div className="order-status-card" data-node-id="15:1311">
                <div className="order-status-summary">
                  <div className="order-number"><strong>#8TT-261027-0186</strong><span>Ngày đặt: 27/10/2026 · 3 sản phẩm</span></div>
                  <div className="order-status-block"><span className="order-overline">TRẠNG THÁI ĐƠN HÀNG</span><span className={`order-status${cancelled ? " is-cancelled" : ""}`}>{cancelled ? "Đã hủy đơn hàng" : "Đã tiếp nhận · Chờ xác nhận"}</span></div>
                  <div className="order-payment"><span className="order-overline">THANH TOÁN</span><span>Chưa thanh toán · COD</span></div>
                </div>
                <div className="order-tracking">
                  <h2>TIẾN TRÌNH ĐƠN HÀNG</h2>
                  <OrderProgress cancelled={cancelled} />
                  <p>{cancelled ? "Đơn hàng đã được hủy." : "8ThreadTech đã tiếp nhận đơn hàng và đang chờ xác nhận. Các bước tiếp theo sẽ được cập nhật tại đây."}</p>
                </div>
              </div>
            </section>

            <section className="order-detail-products" data-node-id="15:1362">
              <div className="order-detail-section-heading"><h2>SẢN PHẨM TRONG ĐƠN</h2><span>3 sản phẩm</span></div>
              <div className="order-detail-product-list">
                {orderProducts.map((product, index) => (
                  <article className="order-detail-product" key={product.name} data-node-id={["15:1367", "15:1379", "15:1390"][index]}>
                    <div className="order-detail-product-image"><img src={product.image} alt={product.name} /></div>
                    <div className="order-detail-product-info"><strong>{product.name}</strong><span>{product.variant}</span></div>
                    <div className="order-detail-quantity"><small>SỐ LƯỢNG</small><span>× 1</span></div>
                    <div className="order-detail-price"><strong>{formatPrice(product.price)}</strong>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div>
                  </article>
                ))}
              </div>
            </section>

            <div className="order-detail-columns">
              <div className="order-detail-delivery-column">
                <section className="order-detail-panel order-address" data-node-id="15:1404">
                  <h2><IconMapPin />ĐỊA CHỈ NHẬN HÀNG</h2>
                  <div className="order-detail-rule" />
                  <div className="order-recipient"><strong>Nguyễn Minh An</strong><span>0987 654 123 · minhan@example.com</span><p>123 Đường Số 8, Phường Thủ Đức, TP. Hồ Chí Minh</p></div>
                </section>
                <section className="order-detail-panel order-shipping" data-node-id="15:1413">
                  <h2><IconTruck />THÔNG TIN VẬN CHUYỂN</h2>
                  <div className="order-shipping-service"><strong>Giao hàng tiêu chuẩn</strong><b>Miễn phí</b></div>
                  <p>Dự kiến 2–5 ngày làm việc sau khi xác nhận đơn hàng.</p>
                  <div className="order-detail-rule" />
                  <div className="order-shipping-meta"><div><span>Đơn vị vận chuyển</span><span>Chưa cập nhật</span></div><div><span>Mã vận đơn</span><span>Chưa có</span></div></div>
                  <small>Đơn hàng chưa được bàn giao cho đơn vị vận chuyển.</small>
                </section>
                <div className="order-detail-contact"><strong>Cần thay đổi thông tin hoặc hỗ trợ đơn hàng?</strong><p>Liên hệ 8Threads và cung cấp mã #8TT-261027-0186 để được hỗ trợ trước khi đơn được xác nhận.</p><a href="mailto:hello@8threadtech.vn">NHẮN TIN CHO 8THREADS <IconArrowUpRight /></a></div>
              </div>

              <div className="order-payment-column">
                <section className="order-detail-panel order-payment-card" data-node-id="15:1437">
                  <h2>THANH TOÁN ĐƠN HÀNG</h2>
                  <div className="order-payment-method"><IconCreditCard /><div><strong>Thanh toán khi nhận hàng (COD)</strong><span>Chưa thanh toán · COD</span></div></div>
                  <div className="order-detail-rule" />
                  <div className="order-payment-costs"><div><span>Tạm tính (3 sản phẩm)</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Giảm giá thêm</span><strong>0 ₫</strong></div><div><span>Phí vận chuyển</span><strong className="is-free">Miễn phí</strong></div></div>
                  <div className="order-detail-rule" />
                  <div className="order-grand-total"><div><strong>TỔNG CỘNG</strong><b>{formatPrice(subtotal)}</b></div><small>Đã bao gồm VAT</small><p>Bạn đã tiết kiệm {formatPrice(savings)} từ giá gốc. Khoản tiết kiệm đã được phản ánh trong giá bán, không trừ thêm.</p></div>
                  <div className="order-cod-note"><strong>Thanh toán {formatPrice(subtotal)} khi nhận hàng.</strong><span>Không yêu cầu chuyển khoản trước.</span></div>
                </section>
                <div className="order-detail-actions">
                  {cancelled ? <p className="order-cancelled-note" role="status">Đơn hàng đã được hủy.</p> : confirmCancel ? (
                    <div className="order-cancel-confirm" role="group" aria-label="Xác nhận hủy đơn hàng"><span>Bạn chắc chắn muốn hủy đơn này?</span><button type="button" onClick={() => { setCancelled(true); setConfirmCancel(false); }}>XÁC NHẬN HỦY</button><button type="button" onClick={() => setConfirmCancel(false)}>GIỮ ĐƠN</button></div>
                  ) : (
                    <><button className="order-cancel-button" type="button" onClick={() => setConfirmCancel(true)}>HỦY ĐƠN HÀNG</button><a className="order-support-button" href="mailto:hello@8threadtech.vn">LIÊN HỆ HỖ TRỢ <IconArrowUpRight /></a></>
                  )}
                  {!cancelled && !confirmCancel && <small>Bạn có thể hủy đơn khi đơn hàng đang chờ xác nhận.</small>}
                </div>
                <a className="order-payment-help" href="mailto:hello@8threadtech.vn"><IconHeadphones />Cần hỗ trợ về thanh toán?</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CartFooter />
    </div>
  );
}

import { useMemo, useState } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconChevronRight,
  IconHeadphones,
  IconLock,
  IconMinus,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconShieldCheck,
  IconShoppingBag,
  IconTrash,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import logo from "../assets/thread-logo.png";
import thread75 from "../assets/list-thread-75.png";
import thread65 from "../assets/list-thread-65.png";
import thread98 from "../assets/list-thread-98.png";
import "./CartPage.css";

const initialItems = [
  { id: "thread-75", name: "THREAD 75", color: "Bạc ánh trăng", switch: "Linear Red Switch", specs: "75%  /  Nhôm CNC  /  3 chế độ", price: 2490000, oldPrice: 2790000, image: thread75 },
  { id: "thread-65", name: "THREAD 65", color: "Đen nguyên bản", switch: "Linear Switch", specs: "65%  /  Hot-swap  /  3 chế độ", price: 1890000, image: thread65 },
  { id: "thread-98", name: "THREAD 98", color: "Trắng sương", switch: "Tactile Brown Switch", specs: "98%  /  Phím số  /  3 chế độ", price: 2190000, oldPrice: 2490000, image: thread98 },
];

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} ₫`;

function CartFooter() {
  return (
    <footer className="cart-footer" data-node-id="3:518">
      <div className="cart-service" data-node-id="3:519">
        <span>8THREADS / NHỊP GÕ CỦA BẠN.</span>
        <div>
          <span><IconTruck />Miễn phí vận chuyển</span>
          <span><IconShieldCheck />Bảo hành 24 tháng</span>
          <span><IconRefresh />Đổi mới trong 7 ngày</span>
        </div>
      </div>
      <div className="cart-footer-main" data-node-id="3:534">
        <div className="cart-about">
          <strong>8ThreadTech</strong>
          <p>Bàn phím không chỉ để gõ. Đó là chất riêng của bạn trong từng nhịp chạm.</p>
          <div><a href="#footer">Facebook</a><a href="#footer">Instagram</a><a href="#footer">TikTok</a></div>
        </div>
        <div className="cart-footer-links"><h2>KHÁM PHÁ</h2><a href="/">Bàn phím</a><a href="/">Keycap</a><a href="/">Phụ kiện</a><a href="/">Về 8Threads Team</a></div>
        <div className="cart-footer-links"><h2>HỖ TRỢ</h2><a href="#footer">Hướng dẫn mua hàng</a><a href="#footer">Chính sách bảo hành</a><a href="#footer">Vận chuyển &amp; đổi trả</a><a href="#footer">Câu hỏi thường gặp</a></div>
        <div className="cart-contact"><h2>KẾT NỐI VỚI CHÚNG TÔI</h2><a className="cart-email" href="mailto:hello@8threadtech.vn">hello@8threadtech.vn</a><p>Thứ 2 – Thứ 7 · 9:00 – 18:00</p><a className="cart-consult" href="mailto:hello@8threadtech.vn">NHẮN TIN TƯ VẤN <IconArrowUpRight /></a></div>
      </div>
      <div className="cart-copyright" data-node-id="3:562"><span>© 2026 8ThreadTech. Tất cả quyền được bảo lưu.</span><span>Điều khoản sử dụng&nbsp; / &nbsp;Chính sách bảo mật</span></div>
    </footer>
  );
}

export default function CartPage() {
  const [items, setItems] = useState(initialItems.map((item) => ({ ...item, quantity: 1 })));
  const [coupon, setCoupon] = useState("");
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const oldTotal = useMemo(() => items.reduce((sum, item) => sum + (item.oldPrice ?? item.price) * item.quantity, 0), [items]);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const savings = oldTotal - subtotal;

  const changeQuantity = (id, change) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item));
  };

  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));

  return (
    <div className="cart-page" data-node-id="3:341">
      <header className="cart-header" data-node-id="3:342">
        <a className="cart-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="3:343"><img src={logo} alt="" data-node-id="3:344" /><span>8ThreadTech</span></a>
        <nav className="cart-nav" aria-label="Danh mục" data-node-id="3:346"><a className="active" href="/">BÀN PHÍM</a><a href="/">KEYCAP</a><a href="/">PHỤ KIỆN</a><a href="/">VỀ 8THREADS TEAM</a></nav>
        <div className="cart-tools" data-node-id="3:359"><button aria-label="Tìm kiếm"><IconSearch /></button><a className="cart-bag" href="/gio-hang" aria-label={`Giỏ hàng: ${quantity} sản phẩm`}><IconShoppingBag /><span>{quantity}</span></a><a href="/dang-nhap" aria-label="Tài khoản"><IconUser /></a></div>
      </header>

      <main>
        <section className="cart-intro" data-node-id="3:368">
          <div className="cart-breadcrumb" data-node-id="3:369"><a href="/">Trang chủ</a><IconChevronRight /><span>Giỏ hàng</span></div>
          <div className="cart-intro-row">
            <div className="cart-heading">
              <div className="cart-signature"><i />8THREADS - “FEEL” THEO TỪNG NHỊP GÕ CỦA BẠN.</div>
              <div className="cart-title-row"><h1>GIỎ HÀNG</h1><span>/ {quantity} SẢN PHẨM</span></div>
            </div>
            <div className="cart-steps" aria-label="Tiến trình đặt hàng"><span className="current">01&nbsp; GIỎ HÀNG</span><i /><span>02&nbsp; THANH TOÁN</span><i /><span className="pending">03&nbsp; HOÀN TẤT</span></div>
          </div>
          <div className="cart-divider" />
        </section>

        <section className="cart-content" data-node-id="3:390">
          <div className="cart-list" data-node-id="3:391">
            <div className="cart-columns"><span>SẢN PHẨM</span><span>SỐ LƯỢNG</span><span>THÀNH TIỀN</span></div>
            {items.length ? <div className="cart-items">
              {items.map((item, index) => (
                <article className="cart-item" key={item.id} data-node-id={["3:396", "3:420", "3:443"][index]}>
                  <div className="cart-item-image"><img src={item.image} alt={item.name} /></div>
                  <div className="cart-item-info"><h2>{item.name}</h2><p>{item.color}</p><span>{item.switch}</span><small>{item.specs}</small><div className="cart-stock"><i />Có sẵn · Giao trong 24h</div></div>
                  <div className="cart-quantity" aria-label={`Số lượng ${item.name}`}><button aria-label={`Giảm số lượng ${item.name}`} onClick={() => changeQuantity(item.id, -1)}><IconMinus /></button><span>{item.quantity}</span><button aria-label={`Tăng số lượng ${item.name}`} onClick={() => changeQuantity(item.id, 1)}><IconPlus /></button></div>
                  <div className="cart-item-total"><strong>{formatPrice(item.price * item.quantity)}</strong>{item.oldPrice && <del>{formatPrice(item.oldPrice * item.quantity)}</del>}<button onClick={() => removeItem(item.id)} aria-label={`Xóa ${item.name}`}><IconTrash />Xóa</button></div>
                </article>
              ))}
            </div> : <div className="cart-empty"><h2>Giỏ hàng đang trống</h2><p>Khám phá những chiếc bàn phím phù hợp với nhịp gõ của bạn.</p><a href="/">TIẾP TỤC MUA SẮM <IconArrowRight /></a></div>}
            {items.length > 0 && <div className="cart-continue"><a href="/"><IconArrowLeft />TIẾP TỤC MUA SẮM</a><span>Bạn đã tiết kiệm {formatPrice(savings)} từ giá gốc.</span></div>}
          </div>

          <aside className="cart-summary" data-node-id="3:473">
            <div className="cart-summary-card" data-node-id="3:474">
              <h2>TÓM TẮT ĐƠN HÀNG</h2>
              <div className="cart-summary-rule" />
              <form className="cart-coupon" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="coupon-code">BẠN CÓ MÃ ƯU ĐÃI?</label>
                <div><input id="coupon-code" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Nhập mã ưu đãi" /><button type="submit" disabled={!coupon.trim()}>ÁP DỤNG</button></div>
              </form>
              <div className="cart-costs"><div><span>Tạm tính ({quantity} sản phẩm)</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Giảm giá</span><strong>0 ₫</strong></div><div><span>Phí vận chuyển</span><strong className="free-shipping">Miễn phí</strong></div></div>
              <div className="cart-summary-rule" />
              <div className="cart-grand-total"><div><strong>TỔNG CỘNG</strong><b>{formatPrice(subtotal)}</b></div><small>Đã bao gồm VAT</small></div>
              <button className="cart-checkout" disabled={!items.length}>TIẾN HÀNH THANH TOÁN <IconArrowRight /></button>
              <div className="cart-secure"><IconLock />Thông tin thanh toán được bảo mật</div>
            </div>
            <div className="cart-help"><IconHeadphones /><div><span>Cần hỗ trợ trước khi đặt hàng?</span><a href="mailto:hello@8threadtech.vn">NHẮN TIN CHO 8THREADS <IconArrowUpRight /></a></div></div>
          </aside>
        </section>
      </main>
      <CartFooter />
    </div>
  );
}

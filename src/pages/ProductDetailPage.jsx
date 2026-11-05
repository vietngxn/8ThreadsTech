import { useState } from "react";
import { IconArrowDown, IconArrowUpRight, IconSearch, IconShoppingBag, IconUser, IconTruck, IconShieldCheck, IconRefresh } from "@tabler/icons-react";
import NoticeToast from "../components/product-detail/NoticeToast";
import keyboard from "../assets/thread-keyboard.png";
import logo from "../assets/thread-logo.png";
import switchImage from "../assets/landing-switch.png";
import keyboard65 from "../assets/landing-65.png";
import keyboard98 from "../assets/landing-98.png";
import keyboard60 from "../assets/landing-60.png";
import desk from "../assets/landing-desk.png";

const colors = [
  { name: "Bạc ánh trăng", value: "#c8c9ca" },
  { name: "Đen nguyên bản", value: "#393b3d" },
  { name: "Đỏ dung nham", value: "#a82125" },
];
const products = [
  { name: "THREAD 65", tag: "NHỎ GỌN", variant: "Đen nguyên bản · Linear Switch", specs: "65% / Hot-swap / 3 chế độ", price: "1.890.000 ₫", image: keyboard65 },
  { name: "THREAD 98", tag: "ĐẦY ĐỦ", variant: "Trắng sương · Tactile Brown Switch", specs: "98% / Phím số / 3 chế độ", price: "2.190.000 ₫", image: keyboard98 },
  { name: "THREAD 60 HE", tag: "TỪ TÍNH", variant: "Đỏ dung nham · Switch từ tính", specs: "60% / Rapid Trigger / 8.000 Hz", price: "2.790.000 ₫", image: keyboard60 },
];
const questions = [
  ["THREAD 75 phù hợp với ai?", "Dành cho người muốn một layout 75% gọn gàng cho cả làm việc lẫn chơi game. Khung nhôm CNC, Linear Red Switch và 3 chế độ kết nối tạo nên một lựa chọn cân bằng."],
  ["Tôi có thể thay switch trên THREAD 75 không?", "Có. Thiết kế hot-swap cho phép bạn thay switch để chọn cảm giác gõ phù hợp với mình."],
  ["Chính sách bảo hành và đổi mới như thế nào?", "Sản phẩm được bảo hành 24 tháng và hỗ trợ đổi mới trong 7 ngày."],
  ["Làm sao để được tư vấn chọn phím?", "Liên hệ với 8ThreadTech qua email để được tư vấn lựa chọn phù hợp với nhu cầu của bạn."],
];

function Label({ children }) { return <div className="landing-label"><span />{children}</div>; }
function ArrowLink({ href, children, className = "" }) { return <a className={`landing-button ${className}`} href={href}>{children}<IconArrowUpRight size={18} /></a>; }

export default function ProductDetailPage() {
  const [color, setColor] = useState(0);
  const [notice, setNotice] = useState("");
  const comingSoon = (name) => setNotice(`${name} đang được hoàn thiện.`);

  return (
    <main className="landing" data-node-id="36:5091">
      <header className="landing-header" data-node-id="36:5093">
        <a className="landing-brand" href="#top"><img src={logo} alt="" /><span>8ThreadTech</span></a>
        <nav aria-label="Danh mục"><a className="active" href="#collection">BÀN PHÍM</a><a href="#space">KEYCAP</a><a href="#space">PHỤ KIỆN</a><a href="#team">VỀ 8THREADS TEAM</a></nav>
        <div className="landing-tools"><button aria-label="Tìm kiếm" onClick={() => comingSoon("Tìm kiếm")}><IconSearch size={22} /></button><button aria-label="Giỏ hàng" onClick={() => comingSoon("Giỏ hàng")}><IconShoppingBag size={22} /><span>0</span></button><button aria-label="Tài khoản" onClick={() => comingSoon("Tài khoản")}><IconUser size={22} /></button></div>
      </header>

      <section id="top" className="landing-hero" data-node-id="36:5113">
        <h1>GEAR UP<br /><span>GAME ON</span></h1>
        <div className="hero-orbit" /><img className="landing-hero-keyboard" src={keyboard} alt="Bàn phím cơ THREAD 75" />
        <div className="hero-copy"><h2>THREAD 75</h2><p>Từng phím gõ, một nhịp cảm hứng. Chất riêng bắt đầu từ bàn phím của bạn.</p><ArrowLink href="#design">KHÁM PHÁ THREAD 75</ArrowLink></div>
        <div className="hero-material">01 / BẠC ÁNH TRĂNG<br />NHÔM CNC · 75%</div>
        <a className="hero-scroll" href="#design"><IconArrowDown size={16} /> CUỘN ĐỂ TÌM HIỂU THÊM</a><span className="hero-signature">DESIGNED FOR YOUR RHYTHM.</span>
      </section>
      <div className="landing-stats" data-node-id="36:5134"><p>NHỎ GỌN TRONG DÁNG.<br />KHÁC BIỆT TRONG CHẤT.</p>{[["75%", "LAYOUT CÂN BẰNG"], ["CNC", "KHUNG NHÔM"], ["3 chế độ", "KẾT NỐI LINH HOẠT"], ["1.000 Hz", "TẦN SỐ PHẢN HỒI"]].map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div>

      <section className="landing-section design-section" id="design" data-node-id="36:5148"><Label>01 / THIẾT KẾ CÓ CHIỀU SÂU</Label><h2>KHÔNG CHỈ ĐẸP.<br />CÒN ĐẬM CHẤT RIÊNG.</h2><div className="design-grid"><div className="design-image"><span>[ 01.01 / FINISH ]</span><img src={keyboard} alt="Chi tiết khung nhôm THREAD 75" /><small>BỀ MẶT NHÔM CNC / BẠC ÁNH TRĂNG</small></div><div className="design-copy"><h3>CHẠM VÀO SỰ KHÁC BIỆT.</h3><p>Khung nhôm CNC tạo nên đường nét dứt khoát. Sắc bạc ánh trăng đi cùng những điểm nhấn đỏ — một tổng thể gọn gàng nhưng không hòa lẫn.</p><div className="design-facts"><div><strong>75%</strong><p>Gọn cho góc bàn.<br />Đủ cho cảm hứng.</p></div><div><strong>CNC</strong><p>Đường nét mạnh.<br />Hoàn thiện tinh tế.</p></div></div></div></div></section>

      <section className="landing-section feel-section" data-node-id="36:5174"><div><Label>02 / FEEL YOUR RHYTHM</Label><h2>ÊM. MƯỢT.<br />CUỐN TỪNG<br />NHỊP CHẠM.</h2><p>Linear Red Switch mang đến cảm giác gõ êm và mượt. Để ý tưởng liền mạch, từ dòng code đầu tiên đến ván game cuối ngày.</p><div className="feel-detail"><strong>HOT-SWAP / ĐỔI SWITCH. ĐỔI CẢM HỨNG.</strong><p>Tự chọn nhịp gõ phù hợp với chất riêng của bạn.</p></div></div><img src={switchImage} alt="Minh họa Linear Red Switch" /></section>

      <section className="landing-section connection-section" data-node-id="36:5190"><Label>03 / GIỮ TRỌN MẠCH CẢM HỨNG</Label><div className="connection-grid"><div><strong className="hz">1.000 Hz</strong><div className="wave" aria-hidden="true">{Array.from({ length: 53 }, (_, i) => <i key={i} style={{ height: i % 9 === 0 ? 44 : i % 4 === 0 ? 29 : 12 }} />)}</div></div><div><h2>BÀN LÀM VIỆC.<br />HAY SÂN CHƠI.</h2><p>3 chế độ kết nối, một nhịp gõ quen thuộc. THREAD 75 sẵn sàng đồng hành khi bạn chuyển từ tập trung làm việc sang hết mình với cuộc chơi.</p><div className="connection-modes"><strong>03</strong><span><b>Chế độ kết nối</b><small>LINH HOẠT THEO NHỊP CỦA BẠN.</small></span></div></div></div></section>

      <section className="landing-section color-section" data-node-id="36:5261"><Label>04 / CHẤT RIÊNG KHÔNG HÒA LẪN</Label><div className="color-grid"><div><h2>GU CỦA BẠN.<br />PHÍM CỦA BẠN.</h2><p>Một chút bạc. Một chấm đỏ. Một góc bàn mang đúng dấu ấn của bạn.</p><div className="landing-swatches" aria-label="Chọn màu sản phẩm">{colors.map((item, index) => <button key={item.name} className={color === index ? "selected" : ""} aria-label={item.name} aria-pressed={color === index} onClick={() => setColor(index)}><span style={{ background: item.value }} /></button>)}</div><strong>{colors[color].name}</strong><small>LINEAR RED SWITCH · ÊM &amp; MƯỢT</small></div><div className="color-image"><div className="color-orbit" /><img src={keyboard} alt="THREAD 75" /><span>YOUR DESK. YOUR SIGNATURE.</span></div></div><div className="color-bottom"><span>THREAD 75 / 75% / NHÔM CNC / HOT-SWAP</span><ArrowLink href="#order">CHỌN THREAD 75</ArrowLink></div></section>

      <section className="landing-section collection-section" id="collection" data-node-id="36:5288"><div className="collection-heading"><div><Label>05 / TÌM ĐÚNG NHỊP CỦA BẠN</Label><h2>Chất riêng trong từng thao tác</h2></div><a href="#collection">TẤT CẢ BÀN PHÍM <IconArrowUpRight size={19} /></a></div><div className="product-grid">{products.map((product) => <article className="landing-product" key={product.name}><div className="product-image"><span>{product.tag}</span><img src={product.image} alt={product.name} /><small>8THREADS / KEYBOARDS</small></div><div className="product-name"><h3>{product.name}</h3><IconArrowUpRight size={20} /></div><p>{product.variant}</p><small>{product.specs}</small><div className="product-price"><strong>{product.price}</strong><button aria-label={`Thêm ${product.name} vào giỏ`} onClick={() => comingSoon("Giỏ hàng")}><IconShoppingBag size={18} /></button></div></article>)}</div></section>

      <section className="space-section" id="space" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,.08)), url(${desk})` }} data-node-id="36:5344"><div><Label>06 / YOUR SPACE. YOUR RULES.</Label><h2>BẬT CHẤT RIÊNG.<br />TỪ GÓC BÀN.</h2><p>Bàn phím không chỉ để gõ. Đó là điểm bắt đầu của một không gian khiến bạn muốn ngồi xuống, tập trung và tạo nên điều khác biệt.</p><button className="landing-button outline" onClick={() => comingSoon("Keycap và phụ kiện")}>KHÁM PHÁ KEYCAP &amp; PHỤ KIỆN <IconArrowUpRight size={18} /></button></div><span>8THREADS / DESK INSPIRATION</span></section>

      <section className="landing-section team-section" id="team" data-node-id="36:5357"><div><Label>07 / VỀ 8THREADS TEAM</Label><svg className="team-infinity" viewBox="0 0 540 175" fill="none" aria-hidden="true">{[0, 10, 20, 30, 40].map((n) => <path key={n} d={`M 15 ${87+n/4} C 60 ${-20+n}, 155 ${-15+n}, 270 87 C 385 ${190-n}, 480 ${195-n}, 525 ${87-n/4} C 480 ${-20+n}, 385 ${-15+n}, 270 87 C 155 ${190-n}, 60 ${195-n}, 15 ${87+n/4}`} stroke="#f02b24" strokeWidth="1" opacity=".8" />)}</svg><small>CHÍN CÁ TÍNH. MỘT NHỊP CHUNG.</small></div><div><h2>KẾT NỐI TỪ<br />NHỮNG KHÁC BIỆT.</h2><p>8Threads Team gồm 9 thành viên đến từ khoa Kĩ thuật phần mềm IUH. Những cá tính khác nhau, cùng gặp nhau trong tinh thần sáng tạo và kết nối.</p><a className="red-link" href="mailto:hello@8threadtech.vn">GẶP GỠ 8THREADS TEAM <IconArrowUpRight size={18} /></a></div></section>

      <section className="landing-section service-section" data-node-id="36:5370"><Label>08 / CHỌN CHẤT RIÊNG. GIỮ SỰ AN TÂM.</Label><div className="service-grid">{[[IconTruck, "Miễn phí vận chuyển", "ĐƯA NHỊP GÕ ĐẾN GÓC BÀN BẠN."], [IconShieldCheck, "Bảo hành 24 tháng", "AN TÂM ĐỒNG HÀNH DÀI LÂU."], [IconRefresh, "Đổi mới trong 7 ngày", "THÊM AN TÂM CHO LỰA CHỌN."]].map(([Icon, title, caption]) => <div key={title}><Icon size={27} stroke={1.5} /><h3>{title}</h3><small>{caption}</small></div>)}</div><div className="faq-grid" id="faq"><div><h2>CÒN ĐIỀU<br />BẠN TÒ MÒ?</h2><p>Để 8Threads giúp bạn tìm chiếc bàn phím đúng gu, đúng nhu cầu.</p><a className="red-link" href="mailto:hello@8threadtech.vn">NHẮN TIN TƯ VẤN <IconArrowUpRight size={18} /></a></div><div>{questions.map(([question, answer], i) => <details key={question} open={i === 0 ? true : undefined}><summary>{question}<span /></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="landing-section order-section" id="order" data-node-id="36:5410"><Label>09 / NHỊP GÕ MỚI BẮT ĐẦU TỪ ĐÂY</Label><h2>ĐẾN LƯỢT BẠN BẬT CHẤT.</h2><div className="order-grid"><img src={keyboard} alt="Bàn phím THREAD 75" /><div><h3>THREAD 75</h3><p>{colors[color].name} · Linear Red Switch</p><div className="order-price"><strong>2.490.000 ₫</strong><del>2.790.000 ₫</del></div><div className="order-buttons"><button onClick={() => comingSoon("Mua hàng")}>MUA NGAY <IconArrowUpRight size={18} /></button><button onClick={() => comingSoon("Giỏ hàng")}><IconShoppingBag size={18} /> THÊM VÀO GIỎ</button></div><small>MIỄN PHÍ VẬN CHUYỂN / BẢO HÀNH 24 THÁNG<br />ĐỔI MỚI TRONG 7 NGÀY</small></div></div></section>

      <footer className="landing-footer" data-node-id="36:5435"><div className="footer-grid"><div><a className="landing-brand" href="#top"><img src={logo} alt="" /><span>8ThreadTech</span></a><p>Bàn phím không chỉ để gõ. Đó là chất riêng của bạn trong từng nhịp chạm.</p></div><div><h4>KHÁM PHÁ</h4><a href="#collection">Bàn phím</a><a href="#space">Keycap</a><a href="#space">Phụ kiện</a><a href="#team">Về 8Threads Team</a></div><div><h4>HỖ TRỢ</h4><a href="#order">Hướng dẫn mua hàng</a><a href="#faq">Chính sách bảo hành</a><a href="#faq">Vận chuyển &amp; đổi trả</a><a href="#faq">Câu hỏi thường gặp</a></div><div><h4>KẾT NỐI VỚI CHÚNG TÔI</h4><a className="footer-email" href="mailto:hello@8threadtech.vn">hello@8threadtech.vn</a><p>Thứ 2 – Thứ 7 · 9:00 – 18:00</p><a className="red-link" href="mailto:hello@8threadtech.vn">NHẮN TIN TƯ VẤN ↗</a></div></div><div className="footer-signature"><strong>FEEL YOUR RHYTHM.</strong><span>8THREADS / NHỊP GÕ CỦA BẠN.</span></div><div className="footer-bottom"><span>© 2026 8ThreadTech. Tất cả quyền được bảo lưu.</span><span>Điều khoản sử dụng / Chính sách bảo mật</span></div></footer>
      <NoticeToast message={notice} onClose={() => setNotice("")} />
    </main>
  );
}

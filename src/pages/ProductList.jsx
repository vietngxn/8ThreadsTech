import { useMemo, useState } from "react";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconMinus,
  IconSearch,
  IconShieldCheck,
  IconShoppingBag,
  IconAdjustmentsHorizontal,
  IconTruck,
  IconRefresh,
  IconUser,
} from "@tabler/icons-react";
import logo from "../assets/thread-logo.png";
import thread75 from "../assets/list-thread-75.png";
import thread65 from "../assets/list-thread-65.png";
import thread98 from "../assets/list-thread-98.png";
import thread80Pro from "../assets/list-thread-80-pro.png";
import thread60He from "../assets/list-thread-60-he.png";
import thread75Air from "../assets/list-thread-75-air.png";
import thread65Lite from "../assets/list-thread-65-lite.png";
import thread87 from "../assets/list-thread-87.png";
import thread100 from "../assets/list-thread-100.png";
import "./ProductList.css";

const products = [
  { id: "thread-75", nodeId: "3:856", name: "THREAD 75", variant: "Bạc ánh trăng · Linear Red Switch", specs: "75% / Nhôm CNC / 3 chế độ", price: 2490000, oldPrice: "2.790.000 đ", image: thread75, imageFrameId: "3:857", imageNodeId: "3:858", badge: "MỚI RA MẮT", colors: ["#c8c9ca", "#393b3d", "#a82125"], layout: "75%", connection: "3 chế độ kết nối", switch: "Linear" },
  { id: "thread-65", nodeId: "3:879", name: "THREAD 65", variant: "Đen nguyên bản · Linear Switch", specs: "65% / Hot-swap / 3 chế độ", price: 1890000, availability: "Có sẵn · Giao trong 24h", image: thread65, imageFrameId: "3:880", imageNodeId: "3:881", badge: "BÁN CHẠY", colors: ["#393b3d", "#c8c9ca"], layout: "65%", connection: "3 chế độ kết nối", switch: "Linear" },
  { id: "thread-98", nodeId: "3:901", name: "THREAD 98", variant: "Trắng sương · Tactile Brown Switch", specs: "98% / Phím số / 3 chế độ", price: 2190000, oldPrice: "2.490.000 đ", image: thread98, imageFrameId: "3:902", imageNodeId: "3:903", badge: "TIẾT KIỆM 300K", colors: ["#d8d2bf", "#393b3d"], layout: "98%", connection: "3 chế độ kết nối", switch: "Tactile" },
  { id: "thread-80-pro", nodeId: "3:924", name: "THREAD 80 PRO", variant: "Xám titan · Linear Silver Switch", specs: "TKL 80% / Nhôm CNC / 8.000 Hz", price: 3290000, availability: "Có sẵn · Giao trong 24h", image: thread80Pro, imageFrameId: "3:925", imageNodeId: "3:926", badge: "HIỆU NĂNG CAO", colors: ["#c8c9ca", "#393b3d"], layout: "80% / TKL", connection: "Có dây USB-C", switch: "Linear" },
  { id: "thread-60-he", nodeId: "3:946", name: "THREAD 60 HE", variant: "Đỏ dung nham · Switch từ tính", specs: "60% / Rapid Trigger / 8.000 Hz", price: 2790000, availability: "Có sẵn · Giao trong 24h", image: thread60He, imageFrameId: "3:947", imageNodeId: "3:948", badge: "MỚI RA MẮT", colors: ["#a82125", "#393b3d"], layout: "60% / 65%", connection: "Có dây USB-C", switch: "Magnetic" },
  { id: "thread-75-air", nodeId: "3:968", name: "THREAD 75 AIR", variant: "Xanh khói · Low-profile Switch", specs: "75% / Siêu mỏng / Bluetooth 5.3", price: 1990000, availability: "Có sẵn · Giao trong 24h", image: thread75Air, imageFrameId: "3:969", imageNodeId: "3:970", badge: "MỎNG NHẸ", colors: ["#738391", "#c8c9ca"], layout: "75%", connection: "Không dây Bluetooth", switch: "Linear" },
  { id: "thread-65-lite", nodeId: "3:991", name: "THREAD 65 LITE", variant: "Kem cát · Linear Red Switch", specs: "65% / Gasket mount / Hot-swap", price: 1290000, oldPrice: "1.490.000 đ", image: thread65Lite, imageFrameId: "3:992", imageNodeId: "3:993", badge: "GIÁ TỐT", colors: ["#d8d2bf", "#393b3d"], layout: "65%", connection: "Có dây USB-C", switch: "Linear" },
  { id: "thread-87", nodeId: "3:1013", name: "THREAD 87", variant: "Đen carbon · Tactile Brown Switch", specs: "TKL 87 phím / RGB / Hot-swap", price: 1690000, availability: "Có sẵn · Giao trong 24h", image: thread87, imageFrameId: "3:1014", imageNodeId: "3:1015", badge: "ĐƯỢC YÊU THÍCH", colors: ["#393b3d", "#c8c9ca"], layout: "80% / TKL", connection: "Có dây USB-C", switch: "Tactile" },
  { id: "thread-100", nodeId: "3:1035", name: "THREAD 100", variant: "Bạc tinh vân · Linear Red Switch", specs: "100% / Phím số / 3 chế độ", price: 2590000, availability: "Có sẵn · Giao trong 24h", image: thread100, imageFrameId: "3:1036", imageNodeId: "3:1037", badge: "LÀM VIỆC CHUYÊN SÂU", colors: ["#c8c9ca", "#393b3d"], layout: "98% / 100%", connection: "3 chế độ kết nối", switch: "Linear" },
];

const filterGroups = [
  { key: "price", title: "KHOẢNG GIÁ", options: ["Dưới 1.500.000 đ", "1.500.000 – 2.500.000 đ", "Trên 2.500.000 đ"] },
  { key: "layout", title: "LAYOUT", options: ["60% / 65% — Nhỏ gọn", "75% — Cân bằng", "80% / TKL — Linh hoạt", "98% / 100% — Đầy đủ"] },
  { key: "connection", title: "KẾT NỐI", options: ["3 chế độ kết nối", "Không dây Bluetooth", "Có dây USB-C"] },
  { key: "switch", title: "LOẠI SWITCH", options: ["Linear — Êm & mượt", "Tactile — Phản hồi rõ", "Magnetic — Từ tính"] },
];

const formatPrice = (price) => `${price.toLocaleString("vi-VN")} đ`;

export default function ProductList() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [category, setCategory] = useState("Tất cả bàn phím");
  const [filters, setFilters] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    const filtered = products.filter((product) => {
      const matchesQuery = `${product.name} ${product.variant} ${product.specs}`.toLocaleLowerCase("vi").includes(normalizedQuery);
      const matchesCategory = category === "Tất cả bàn phím" || (category === "Bàn phím gaming" ? product.switch === "Magnetic" : category === "Bàn phím low-profile" ? product.name.includes("AIR") : true);
      const matchesStock = !inStockOnly || Boolean(product.availability);
      const matchesFilters = filters.every((filter) => {
        if (filter.startsWith("Dưới")) return product.price < 1500000;
        if (filter.startsWith("1.500.000")) return product.price >= 1500000 && product.price <= 2500000;
        if (filter.startsWith("Trên")) return product.price > 2500000;
        if (filter.includes("60% / 65%")) return /60%|65%/.test(product.layout);
        if (filter.startsWith("75%")) return product.layout.includes("75%");
        if (filter.includes("80% / TKL")) return /80%|TKL/.test(product.layout);
        if (filter.includes("98% / 100%")) return /98%|100%/.test(product.layout);
        if (filter.startsWith("3 chế độ")) return product.connection === "3 chế độ kết nối";
        if (filter.startsWith("Không dây")) return product.connection === "Không dây Bluetooth";
        if (filter.startsWith("Có dây")) return product.connection === "Có dây USB-C";
        if (filter.startsWith("Linear")) return product.switch === "Linear";
        if (filter.startsWith("Tactile")) return product.switch === "Tactile";
        if (filter.startsWith("Magnetic")) return product.switch === "Magnetic";
        return true;
      });
      return matchesQuery && matchesCategory && matchesStock && matchesFilters;
    });
    if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [category, filters, inStockOnly, query, sort]);

  const toggleFilter = (value) => {
    setFilters((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  };

  return (
    <div className="product-list" data-node-id="3:708">
      <header className="pl-header" data-node-id="3:709">
        <a className="pl-brand" href="#top" aria-label="8ThreadTech trang chủ" data-node-id="3:710">
          <img src={logo} alt="" data-node-id="3:711" />
          <span data-node-id="3:712">8ThreadTech</span>
        </a>
        <nav className="pl-nav" aria-label="Danh mục" data-node-id="3:713">
          <a className="active" href="#products" data-node-id="3:714">BÀN PHÍM</a>
          <a href="#products" data-node-id="3:717">KEYCAP</a>
          <a href="#products" data-node-id="3:720">PHỤ KIỆN</a>
          <a href="#footer" data-node-id="3:723">VỀ 8THREADS TEAM</a>
        </nav>
        <div className="pl-tools" data-node-id="3:726">
          <button aria-label="Tìm kiếm" onClick={() => document.querySelector("#product-search")?.focus()}><IconSearch size={20} stroke={1.6} /></button>
          <a className="pl-cart" href="/gio-hang" aria-label={`Giỏ hàng: ${cartCount} sản phẩm`}><IconShoppingBag size={20} stroke={1.6} /><span>{cartCount}</span></a>
          <a href="/dang-nhap" aria-label="Tài khoản"><IconUser size={20} stroke={1.6} /></a>
        </div>
      </header>

      <main id="top">
        <section className="pl-category" data-node-id="3:735">
          <div className="pl-breadcrumb" data-node-id="3:736"><a href="#top" data-node-id="3:737">Trang chủ</a><IconChevronRight size={12} /><span data-node-id="3:740">Bàn phím</span></div>
          <div className="pl-intro" data-node-id="3:741">
            <div className="pl-heading" data-node-id="3:742">
              <div className="pl-signature" data-node-id="3:743"><i data-node-id="3:744" /><span data-node-id="3:745">8THREADS - “FEEL” NHỊP GÕ CỦA BẠN.</span></div>
              <div className="pl-title-row" data-node-id="3:746"><h1 data-node-id="3:747">BÀN PHÍM</h1><span data-node-id="3:748">/ 24 SẢN PHẨM</span></div>
            </div>
            <div className="pl-message" data-node-id="3:749"><h2 data-node-id="3:750">CHẠM PHÍM. BẬT CHẤT RIÊNG</h2><p data-node-id="3:751">Tìm nhịp gõ riêng, từ góc làm việc tối giản đến những trận game không giới hạn.</p></div>
          </div>
          <div className="pl-divider" data-node-id="3:752" />
        </section>

        <section className="pl-catalog" id="products" data-node-id="3:753">
          <aside className="pl-sidebar" data-node-id="3:754">
            <div className="pl-filter-title" data-node-id="3:755"><IconAdjustmentsHorizontal size={17} data-node-id="3:756" /><span data-node-id="3:758">BỘ LỌC</span></div>
            <section className="pl-filter-group pl-category-filter" data-node-id="3:759">
              <h2 data-node-id="3:760">DÒNG BÀN PHÍM</h2>
              {["Tất cả bàn phím", "Bàn phím cơ", "Bàn phím gaming", "Bàn phím low-profile"].map((item, index) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}><span>{item}</span><small>{["24", "16", "5", "3"][index]}</small></button>)}
            </section>
            {filterGroups.map((group, groupIndex) => (
              <fieldset className="pl-filter-group" key={group.key} data-node-id={["3:773", "3:787", "3:804", "3:818"][groupIndex]}>
                <legend><span>{group.title}</span><IconMinus size={14} data-node-id={["3:776", "3:790", "3:807", "3:821"][groupIndex]} /></legend>
                {group.options.map((option) => <label key={option} className="pl-check"><input type="checkbox" checked={filters.includes(option)} onChange={() => toggleFilter(option)} /><span>{option}</span></label>)}
              </fieldset>
            ))}
            <label className="pl-stock" data-node-id="3:832"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} /><span>Chỉ hiển thị hàng có sẵn</span></label>
            <div className="pl-help" data-node-id="3:835"><h2 data-node-id="3:836">CHƯA BIẾT CHỌN GÌ?</h2><p data-node-id="3:837">Để 8Threads giúp bạn tìm chiếc bàn phím đúng gu, đúng nhu cầu.</p><a href="mailto:hello@8threadtech.vn" data-node-id="3:838">TƯ VẤN CHỌN PHÍM <IconArrowUpRight size={15} data-node-id="3:840" /></a></div>
          </aside>

          <div className="pl-results" data-node-id="3:842">
            <div className="pl-toolbar" data-node-id="3:843">
              <p data-node-id="3:844">{visibleProducts.length ? `Hiển thị 1–${visibleProducts.length} trong 24 sản phẩm` : "Không tìm thấy sản phẩm phù hợp"}</p>
              <div className="pl-controls" data-node-id="3:845">
                <label className="pl-search"><IconSearch size={15} data-node-id="3:847" /><input id="product-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm bàn phím của bạn..." /></label>
                <label className="pl-sort"><span className="sr-only">Sắp xếp sản phẩm</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Sắp xếp: Bán chạy nhất</option><option value="price-asc">Giá: Thấp đến cao</option><option value="price-desc">Giá: Cao đến thấp</option></select><IconChevronDown size={14} data-node-id="3:852" /></label>
              </div>
            </div>
            {visibleProducts.length ? <div className="pl-grid" data-node-id="3:854">
              {visibleProducts.map((product) => <article className="pl-product" key={product.id} data-node-id={product.nodeId}>
                <div className="pl-product-image" data-node-id={product.imageFrameId}>
                  <img src={product.image} alt={product.name} data-node-id={product.imageNodeId} />
                  <span className={`pl-badge ${product.badge === "MỚI RA MẮT" ? "is-new" : ""}`}>{product.badge}</span>
                  <small>8THREADS / KEYBOARDS</small>
                </div>
                <div className="pl-product-info">
                  <div className="pl-product-title"><h2>{product.name}</h2><div className="pl-swatches" aria-label="Màu sắc">{product.colors.map((color) => <span key={color} style={{ "--swatch": color }} />)}</div></div>
                  <p>{product.variant}</p><small className="pl-specs">{product.specs}</small>
                  <div className="pl-price-row"><div><strong>{formatPrice(product.price)}</strong><small>{product.oldPrice ? <del>{product.oldPrice}</del> : product.availability}</small></div><button aria-label={`Thêm ${product.name} vào giỏ hàng`} onClick={() => setCartCount((count) => count + 1)}><IconShoppingBag size={17} stroke={1.6} /></button></div>
                </div>
              </article>)}
            </div> : <div className="pl-empty"><span>Không có sản phẩm nào phù hợp với lựa chọn của bạn.</span><button onClick={() => { setFilters([]); setCategory("Tất cả bàn phím"); setQuery(""); setInStockOnly(false); }}>Xóa bộ lọc</button></div>}
            <div className="pl-pagination" data-node-id="3:1057">
              <p>Bạn đang xem {visibleProducts.length ? `${visibleProducts.length} / 24` : "0 / 24"} sản phẩm</p>
              <div><button aria-label="Trang trước" disabled><IconChevronLeft size={16} /></button><button className="current" aria-current="page">1</button><button disabled>2</button><button disabled>3</button><button className="next" disabled>Trang sau <IconArrowRight size={15} /></button></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pl-footer" id="footer" data-node-id="3:1073">
        <div className="pl-service" data-node-id="3:1074"><span>8THREADS / NHỊP GÕ CỦA BẠN.</span><div><span><IconTruck size={17} data-node-id="3:1078" />Miễn phí vận chuyển</span><span><IconShieldCheck size={17} data-node-id="3:1082" />Bảo hành 24 tháng</span><span><IconRefresh size={17} data-node-id="3:1086" />Đổi mới trong 7 ngày</span></div></div>
        <div className="pl-footer-main" data-node-id="3:1089">
          <div className="pl-about" data-node-id="3:1090"><strong data-node-id="3:1091">8ThreadTech</strong><p data-node-id="3:1092">Bàn phím không chỉ để gõ. Đó là chất riêng của bạn trong từng nhịp chạm.</p><div><a href="#footer">Facebook</a><a href="#footer">Instagram</a><a href="#footer">TikTok</a></div></div>
          <div className="pl-footer-links"><h2>KHÁM PHÁ</h2><a href="#products">Bàn phím</a><a href="#products">Keycap</a><a href="#products">Phụ kiện</a><a href="#footer">Về 8Threads Team</a></div>
          <div className="pl-footer-links"><h2>HỖ TRỢ</h2><a href="#footer">Hướng dẫn mua hàng</a><a href="#footer">Chính sách bảo hành</a><a href="#footer">Vận chuyển &amp; đổi trả</a><a href="#footer">Câu hỏi thường gặp</a></div>
          <div className="pl-contact"><h2>KẾT NỐI VỚI CHÚNG TÔI</h2><a className="pl-email" href="mailto:hello@8threadtech.vn">hello@8threadtech.vn</a><p>Thứ 2 – Thứ 7 · 9:00 – 18:00</p><a className="pl-consult" href="mailto:hello@8threadtech.vn">NHẮN TIN TƯ VẤN <IconArrowUpRight size={14} /></a></div>
        </div>
        <div className="pl-copyright" data-node-id="3:1117"><span>© 2026 8ThreadTech. Tất cả quyền được bảo lưu.</span><span>Điều khoản sử dụng&nbsp; / &nbsp;Chính sách bảo mật</span></div>
      </footer>
    </div>
  );
}

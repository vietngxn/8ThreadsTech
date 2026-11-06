import logoImage from "../../assets/thread-logo.png";
import { IconSearch, IconShoppingBag } from "@tabler/icons-react";

export default function PageHeader({ onComingSoon }) {
  return (
    <header className="thread-header" data-node-id="3:1121">
      <a className="thread-brand" href="/" aria-label="8ThreadTech trang chủ">
        <img src={logoImage} alt="" />
        <span>8ThreadTech</span>
      </a>
      <nav className="thread-nav" aria-label="Danh mục">
        <a className="active" href="/ban-phim">BÀN PHÍM</a>
        <button onClick={() => onComingSoon("Keycap")}>KEYCAP</button>
        <button onClick={() => onComingSoon("Phụ kiện")}>PHỤ KIỆN</button>
        <a href="/ve-8threads-team">VỀ 8THREADS TEAM</a>
      </nav>
      <div className="thread-utilities">
        <button aria-label="Tìm kiếm" onClick={() => onComingSoon("Tìm kiếm")}>
          <IconSearch size={22} stroke={1.6} />
        </button>
        <a className="bag-button" href="/gio-hang" aria-label="Giỏ hàng">
          <IconShoppingBag size={22} stroke={1.6} />
          <span>0</span>
        </a>
      </div>
    </header>
  );
}

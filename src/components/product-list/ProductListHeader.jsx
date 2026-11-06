import { IconSearch, IconShoppingBag, IconUser } from "@tabler/icons-react";
import logo from "../../assets/thread-logo.png";

export default function ProductListHeader({ cartCount }) {
  return (
    <header className="pl-header" data-node-id="3:709">
      <a className="pl-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="3:710">
        <img src={logo} alt="" data-node-id="3:711" />
        <span data-node-id="3:712">8ThreadTech</span>
      </a>
      <nav className="pl-nav" aria-label="Danh mục" data-node-id="3:713">
        <a className="active" href="/ban-phim" data-node-id="3:714">BÀN PHÍM</a>
        <a href="#products" data-node-id="3:717">KEYCAP</a>
        <a href="#products" data-node-id="3:720">PHỤ KIỆN</a>
        <a href="/ve-8threads-team" data-node-id="3:723">VỀ 8THREADS TEAM</a>
      </nav>
      <div className="pl-tools" data-node-id="3:726">
        <button aria-label="Tìm kiếm" onClick={() => document.querySelector("#product-search")?.focus()}>
          <IconSearch size={20} stroke={1.6} />
        </button>
        <a className="pl-cart" href="/gio-hang" aria-label={`Giỏ hàng: ${cartCount} sản phẩm`}>
          <IconShoppingBag size={20} stroke={1.6} />
          <span>{cartCount}</span>
        </a>
        <a href="/dang-nhap" aria-label="Tài khoản">
          <IconUser size={20} stroke={1.6} />
        </a>
      </div>
    </header>
  );
}

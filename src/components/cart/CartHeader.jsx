import { IconSearch, IconShoppingBag, IconUser } from "@tabler/icons-react";
import logo from "../../assets/thread-logo.png";

export default function CartHeader({ quantity }) {
  return (
    <header className="cart-header" data-node-id="3:342">
      <a className="cart-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="3:343">
        <img src={logo} alt="" data-node-id="3:344" />
        <span>8ThreadTech</span>
      </a>
      <nav className="cart-nav" aria-label="Danh mục" data-node-id="3:346">
        <a className="active" href="/ban-phim">BÀN PHÍM</a>
        <a href="/ban-phim">KEYCAP</a>
        <a href="/ban-phim">PHỤ KIỆN</a>
        <a href="/ve-8threads-team">VỀ 8THREADS TEAM</a>
      </nav>
      <div className="cart-tools" data-node-id="3:359">
        <button aria-label="Tìm kiếm">
          <IconSearch />
        </button>
        <a className="cart-bag" href="/gio-hang" aria-label={`Giỏ hàng: ${quantity} sản phẩm`}>
          <IconShoppingBag />
          <span>{quantity}</span>
        </a>
        <a href="/dang-nhap" aria-label="Tài khoản">
          <IconUser />
        </a>
      </div>
    </header>
  );
}

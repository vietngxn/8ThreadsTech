import { IconSearch, IconShoppingBag, IconUser } from "@tabler/icons-react";
import logo from "../../assets/login-logo.png";

export default function LoginHeader() {
  return (
    <header className="login-header" data-node-id="3:566">
      <a className="login-header-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="3:567">
        <img src={logo} alt="" data-node-id="3:568" />
        <span data-node-id="3:569">8ThreadTech</span>
      </a>
      <nav className="login-nav" aria-label="Danh mục" data-node-id="3:570">
        <a href="/#products" data-node-id="3:571">BÀN PHÍM</a>
        <a href="/#products" data-node-id="3:572">KEYCAP</a>
        <a href="/#products" data-node-id="3:573">PHỤ KIỆN</a>
        <a href="/#footer" data-node-id="3:574">VỀ 8THREADS TEAM</a>
      </nav>
      <div className="login-header-tools" data-node-id="3:575">
        <a href="/#product-search" aria-label="Tìm kiếm" data-node-id="3:576">
          <IconSearch size={19} stroke={1.5} />
        </a>
        <a href="/#products" className="login-header-cart" aria-label="Giỏ hàng: 0 sản phẩm" data-node-id="3:578">
          <IconShoppingBag size={19} stroke={1.5} />
          <span data-node-id="3:581">0</span>
        </a>
        <a href="/dang-nhap" aria-label="Tài khoản" aria-current="page" data-node-id="3:582">
          <IconUser size={19} stroke={1.5} />
        </a>
      </div>
    </header>
  );
}

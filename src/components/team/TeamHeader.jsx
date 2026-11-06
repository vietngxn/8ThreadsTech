import { IconSearch, IconShoppingBag, IconUser } from "@tabler/icons-react";
import logo from "../../assets/team-logo.png";

export default function TeamHeader() {
  return (
    <header className="team-header" data-node-id="30:1306">
      <a className="team-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="30:1307">
        <img src={logo} alt="" data-node-id="30:1308" />
        <span data-node-id="30:1309">8ThreadTech</span>
      </a>
      <nav aria-label="Danh mục" data-node-id="30:1310">
        <a href="/ban-phim">BÀN PHÍM</a>
        <a href="/ban-phim">KEYCAP</a>
        <a href="/ban-phim">PHỤ KIỆN</a>
        <a className="active" href="/ve-8threads-team">VỀ 8THREADS TEAM</a>
      </nav>
      <div className="team-tools" data-node-id="30:1315">
        <a href="/" aria-label="Tìm kiếm"><IconSearch size={19} stroke={1.5} /></a>
        <a href="/gio-hang" aria-label="Giỏ hàng"><IconShoppingBag size={19} stroke={1.5} /><span>0</span></a>
        <a href="/dang-nhap" aria-label="Tài khoản"><IconUser size={19} stroke={1.5} /></a>
      </div>
    </header>
  );
}
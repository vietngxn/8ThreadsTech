import { IconSearch, IconShoppingBag, IconUser } from '@tabler/icons-react';
import { useNavbar } from '../../hooks/useNavbar';
import logo from '../../assets/thread-logo.png';

export default function Navbar({ onComingSoon }) {
  const navRef = useNavbar();

  return (
    <header ref={navRef} className="landing-header" data-node-id="36:5093">
      <a className="landing-brand" href="/">
        <img src={logo} alt="" />
        <span>8ThreadTech</span>
      </a>
      <nav aria-label="Danh mục">
        <a className="active" href="/ban-phim">BÀN PHÍM</a>
        <a href="#space" onClick={(e) => { e.preventDefault(); onComingSoon("Keycap"); }}>KEYCAP</a>
        <a href="#space" onClick={(e) => { e.preventDefault(); onComingSoon("Phụ kiện"); }}>PHỤ KIỆN</a>
        <a href="/ve-8threads-team">VỀ 8THREADS TEAM</a>
      </nav>
      <div className="landing-tools">
        <button aria-label="Tìm kiếm" onClick={() => onComingSoon("Tìm kiếm")}>
          <IconSearch size={22} />
        </button>
        <a href="/gio-hang" aria-label="Giỏ hàng">
          <IconShoppingBag size={22} />
          <span>0</span>
        </a>
        <a href="/dang-nhap" aria-label="Tài khoản">
          <IconUser size={22} />
        </a>
      </div>
    </header>
  );
}

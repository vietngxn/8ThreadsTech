import { IconSearch, IconShoppingBag, IconUser } from '@tabler/icons-react';
import { useNavbar } from '../../hooks/useNavbar';
import logo from '../../assets/thread-logo.png';

export default function Navbar({ onComingSoon }) {
  const navRef = useNavbar();

  return (
    <header ref={navRef} className="landing-header" data-node-id="36:5093">
      <a className="landing-brand" href="#top">
        <img src={logo} alt="" />
        <span>8ThreadTech</span>
      </a>
      <nav aria-label="Danh mục">
        <a className="active" href="#collection">BÀN PHÍM</a>
        <a href="#space">KEYCAP</a>
        <a href="#space">PHỤ KIỆN</a>
        <a href="#team">VỀ 8THREADS TEAM</a>
      </nav>
      <div className="landing-tools">
        <button aria-label="Tìm kiếm" onClick={() => onComingSoon("Tìm kiếm")}>
          <IconSearch size={22} />
        </button>
        <button aria-label="Giỏ hàng" onClick={() => onComingSoon("Giỏ hàng")}>
          <IconShoppingBag size={22} />
          <span>0</span>
        </button>
        <button aria-label="Tài khoản" onClick={() => onComingSoon("Tài khoản")}>
          <IconUser size={22} />
        </button>
      </div>
    </header>
  );
}

import { IconArrowUpRight, IconChevronRight, IconLock, IconLogout, IconMapPin, IconPackage, IconSearch, IconShoppingBag, IconUser } from "@tabler/icons-react";
import logo from "../../assets/thread-logo.png";
import { authService } from "../../services/authService";

export default function AddressSidebar() {
  const currentUser = authService.getCurrentUser();
  const displayName = currentUser?.fullName || currentUser?.name || "Khách hàng 8Threads";
  const displayEmail = currentUser?.email || "";

  const getInitials = (name) => {
    if (!name) return "8T";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    authService.logout("/dang-nhap");
  };
  return (
    <aside className="address-sidebar" data-node-id="20:36">
      <div className="address-identity" data-node-id="20:37">
        <div className="address-avatar" data-node-id="20:38"><span data-node-id="20:39">{getInitials(displayName)}</span></div>
        <div className="address-identity-copy" data-node-id="20:40"><strong data-node-id="20:41">{displayName}</strong><span data-node-id="20:42">{displayEmail}</span></div>
        <small data-node-id="20:43">TÀI KHOẢN NGƯỜI DÙNG</small>
      </div>
      <div className="address-sidebar-rule" data-node-id="20:44" />
      <nav className="address-account-menu" aria-label="Điều hướng tài khoản" data-node-id="20:45">
        <a href="/ho-so" data-node-id="20:46"><IconUser data-node-id="20:47" /><span data-node-id="20:48">Hồ sơ cá nhân</span><IconChevronRight /></a>
        <a href="/don-hang" data-node-id="20:49"><IconPackage data-node-id="20:50" /><span data-node-id="20:51">Đơn hàng của tôi</span><IconChevronRight /></a>
        <a className="is-active" href="/so-dia-chi" aria-current="page" data-node-id="20:52"><IconMapPin data-node-id="20:53" /><span data-node-id="20:54">Sổ địa chỉ</span><IconChevronRight data-node-id="20:55" /></a>
        <a href="/doi-mat-khau" data-node-id="20:56"><IconLock data-node-id="20:57" /><span data-node-id="20:58">Đổi mật khẩu</span><IconChevronRight /></a>
        <button type="button" className="profile-logout" onClick={handleLogout} data-node-id="20:59">
          <IconLogout data-node-id="20:60" />
          <span data-node-id="20:61">Đăng xuất</span>
        </button>
      </nav>
      <div className="address-sidebar-rule address-help-rule" data-node-id="20:62" />
      <div className="address-help" data-node-id="20:63"><p data-node-id="20:64">Cần hỗ trợ về tài khoản của bạn?</p><a href="mailto:hello@8threadtech.vn" data-node-id="20:65"><span data-node-id="20:66">NHẮN TIN CHO 8THREADS</span><IconArrowUpRight data-node-id="20:67" /></a></div>
    </aside>
  );
}
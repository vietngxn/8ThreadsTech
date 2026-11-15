import { IconUser, IconLock, IconMapPin, IconLogout, IconPackage, IconChevronRight, IconArrowUpRight } from "@tabler/icons-react";
import { authService } from "../../services/authService";

const menuItems = [
  { id: "profile", label: "Hồ sơ cá nhân", icon: IconUser, href: "/ho-so" },
  { id: "orders", label: "Đơn hàng của tôi", icon: IconPackage, href: "/don-hang" },
  { id: "address", label: "Sổ địa chỉ", icon: IconMapPin, href: "/so-dia-chi" },
  { id: "change-password", label: "Đổi mật khẩu", icon: IconLock, href: "/doi-mat-khau" },
];

export default function ProfileSidebar({ currentPage }) {
  const currentUser = authService.getCurrentUser();
  const displayName = currentUser?.fullName || currentUser?.name || "Khách hàng 8Threads";
  const displayEmail = currentUser?.email || (authService.getToken() ? "Đã đăng nhập" : "Chưa đăng nhập");

  const getInitials = (name) => {
    if (!name) return "8T";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/dang-nhap";
  };

  return (
    <aside className="profile-sidebar" data-node-id="8:848">
      <div className="profile-identity" data-node-id="8:849">
        <div className="profile-avatar" data-node-id="8:850">
          <span data-node-id="8:851">{getInitials(displayName)}</span>
        </div>
        <div className="profile-identity-copy" data-node-id="8:852">
          <strong data-node-id="8:853">{displayName}</strong>
          <span data-node-id="8:854">{displayEmail}</span>
        </div>
        <small data-node-id="8:855">TÀI KHOẢN NGƯỜI DÙNG</small>
      </div>
      <div className="profile-sidebar-rule" data-node-id="8:856" />
      <nav className="profile-menu" aria-label="Điều hướng tài khoản" data-node-id="8:857">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={currentPage === item.id ? "is-active" : ""}
            aria-current={currentPage === item.id ? "page" : undefined}
          >
            <item.icon size={19} data-node-id={`8:1023`} />
            <span data-node-id={`8:860`}>{item.label}</span>
            <IconChevronRight data-node-id={`8:861`} />
          </a>
        ))}
        <button className="profile-logout" type="button" onClick={handleLogout}>
          <IconLogout size={19} />
          Đăng xuất
        </button>
      </nav>
      <div className="profile-sidebar-rule profile-help-rule" data-node-id="8:874" />
      <div className="profile-help" data-node-id="8:875"><p data-node-id="8:876">Cần hỗ trợ về tài khoản của bạn?</p><a href="mailto:hello@8threadtech.vn" data-node-id="8:877"><span data-node-id="8:878">NHẮN TIN CHO 8THREADS</span><IconArrowUpRight data-node-id="8:879" /></a></div>
    </aside>
  );
}
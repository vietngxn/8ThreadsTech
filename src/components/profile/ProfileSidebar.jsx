import { IconUser, IconLock, IconMapPin, IconLogout, IconPackage, IconShieldCheck } from "@tabler/icons-react";

const menuItems = [
  { id: "profile", label: "Hồ sơ cá nhân", icon: IconUser, href: "/ho-so" },
  { id: "orders", label: "Đơn hàng của tôi", icon: IconPackage, href: "/don-hang" },
  { id: "address", label: "Sổ địa chỉ", icon: IconMapPin, href: "/so-dia-chi" },
  { id: "change-password", label: "Đổi mật khẩu", icon: IconShieldCheck, href: "/doi-mat-khau" },
];

export default function ProfileSidebar({ currentPage }) {
  const getInitials = (name) => {
    return name.split(" ").map((part) => part[0]).slice(-2).join("").toUpperCase();
  };

  return (
    <aside className="profile-sidebar" data-node-id="8:848">
      <div className="profile-identity" data-node-id="8:849">
        <div className="profile-avatar" data-node-id="8:850"><span data-node-id="8:851">{getInitials(currentPage)}</span></div>
        <div className="profile-identity-copy" data-node-id="8:852"><strong data-node-id="8:853">Khách hàng 8Threads</strong><span data-node-id="8:854">Chưa đăng nhập</span></div>
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
        <button className="profile-logout">
          <IconLogout size={19} />
          Đăng xuất
        </button>
      </nav>
      <div className="profile-sidebar-rule profile-help-rule" data-node-id="8:874" />
      <div className="profile-help" data-node-id="8:875"><p data-node-id="8:876">Cần hỗ trợ về tài khoản của bạn?</p><a href="mailto:hello@8threadtech.vn" data-node-id="8:877"><span data-node-id="8:878">NHẮN TIN CHO 8THREADS</span><IconArrowUpRight data-node-id="8:879" /></a></div>
    </aside>
  );
}
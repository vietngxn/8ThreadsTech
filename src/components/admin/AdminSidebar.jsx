import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  IconArrowLeft,
  IconChartLine,
  IconChevronDown,
  IconFileText,
  IconFolder,
  IconHelpCircle,
  IconLayoutDashboard,
  IconLogout,
  IconPackage,
  IconSettings,
  IconShoppingBag,
  IconTicket,
  IconUsers,
} from "@tabler/icons-react";
import logo from "../../assets/thread-logo.png";
import { authService } from "../../services/authService";
import { adminOrderService } from "../../services/adminOrderService";
import "./AdminSidebar.css";

const MENU_ITEMS = [
  { id: "dashboard", label: "Tổng quan", href: "/admin", icon: IconLayoutDashboard },
  { id: "products", label: "Sản phẩm", href: "/admin/products", icon: IconPackage },
  { id: "categories", label: "Danh mục", href: "/admin/categories", icon: IconFolder },
  { id: "orders", label: "Đơn hàng", href: "/admin/orders", icon: IconShoppingBag },
  { id: "customers", label: "Khách hàng", href: "/admin/customers", icon: IconUsers },
  { id: "promotions", label: "Khuyến mãi", href: "/admin/promotions", icon: IconTicket },
  { id: "stats", label: "Thống kê", href: "/admin/statistics", icon: IconChartLine },
  { id: "logs", label: "Nhật kí", href: "/admin/logs", icon: IconFileText },
];

/**
 * Component Sidebar dùng chung cho toàn bộ các màn hình Quản trị Admin.
 *
 * @param {string} [props.active] - Key của menu item đang active ('dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'promotions' | 'stats').
 *                                  Nếu không truyền, component tự động nhận diện theo URL hiện tại.
 * @param {Object} [props.badgeCounts] - Tuỳ chỉnh số đếm badge (mặc định: { orders: "12" }).
 * @param {string} [props.className] - ClassName bổ sung cho thẻ aside.
 */
export default function AdminSidebar({ active, badgeCounts = {}, className = "" }) {
  const location = useLocation();
  const pathname = location.pathname;

  // Lấy số đơn PENDING thực từ API để hiển thị badge chính xác
  const [pendingCount, setPendingCount] = useState(null);
  useEffect(() => {
    let cancelled = false;
    adminOrderService
      .getOrders({ page: 0, size: 1, status: "PENDING" })
      .then((res) => { if (!cancelled) setPendingCount(res.totalElements); })
      .catch(() => {}); // Không block UI nếu lỗi
    return () => { cancelled = true; };
  }, []);

  // Tự động nhận diện tab active dựa vào pathname nếu không truyền prop `active`
  const getActiveTab = () => {
    if (active) return active;
    if (pathname === "/admin" || pathname === "/admin/dashboard") return "dashboard";
    if (pathname.startsWith("/admin/products")) return "products";
    if (pathname.startsWith("/admin/categories")) return "categories";
    if (pathname.startsWith("/admin/orders")) return "orders";
    if (pathname.startsWith("/admin/customers")) return "customers";
    if (pathname.startsWith("/admin/promotions")) return "promotions";
    if (pathname.startsWith("/admin/statistics")) return "stats";
    if (pathname.startsWith("/admin/logs")) return "logs";
    return "";
  };

  const currentActive = getActiveTab();

  return (
    <aside className={`admin-sidebar ${className}`.trim()} aria-label="Thanh điều hướng quản trị">
      <Link className="admin-brand" to="/admin" aria-label="8ThreadTech - Trang quản trị">
        <img src={logo} alt="8ThreadTech Logo" />
        <strong>8ThreadTech</strong>
      </Link>

      <nav aria-label="Quản lý cửa hàng">
        <span className="admin-nav-label">QUẢN LÝ</span>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentActive === item.id;
          const badge = badgeCounts[item.id] !== undefined
            ? badgeCounts[item.id]
            : item.id === "orders"
              ? (pendingCount !== null ? (pendingCount > 0 ? String(pendingCount) : null) : null)
              : item.defaultBadge;

          const innerContent = (
            <>
              <Icon size={19} stroke={1.5} />
              <span>{item.label}</span>
              {badge && <b>{badge}</b>}
            </>
          );

          if (!item.href) {
            return (
              <div
                key={item.id}
                className="admin-nav-item admin-nav-item-disabled"
                title="Tính năng đang được hoàn thiện"
              >
                {innerContent}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.href}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {innerContent}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-bottom">
        <Link to="/" className="admin-support" title="Quay lại giao diện cửa hàng">
          <IconArrowLeft size={18} stroke={1.5} />
          <span>Về cửa hàng</span>
        </Link>
        <Link to="/admin/help" className={`admin-support admin-help-link ${pathname === "/admin/help" ? "active" : ""}`} aria-current={pathname === "/admin/help" ? "page" : undefined}>
          <IconHelpCircle size={18} stroke={1.5} />
          <span>Trung tâm trợ giúp</span>
        </Link>
        <Link to="/admin/settings" className={`admin-support admin-settings-link ${pathname === "/admin/settings" ? "active" : ""}`} aria-current={pathname === "/admin/settings" ? "page" : undefined}>
          <IconSettings size={18} stroke={1.5} />
          <span>Cài đặt</span>
        </Link>
        <button
          type="button"
          className="admin-support admin-logout-btn"
          onClick={() => authService.logout("/dang-nhap")}
          style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
        >
          <IconLogout size={18} stroke={1.5} />
          <span>Đăng xuất</span>
        </button>
        <Link to="/admin/profile" className="admin-account" aria-label="Sửa hồ sơ quản trị viên">
          {(() => {
            const currentUser = authService.getCurrentUser();
            const adminName = currentUser?.fullName || currentUser?.name || "Quản trị viên";
            const parts = adminName.trim().split(/\s+/);
            const initials = parts.length === 1
              ? parts[0].slice(0, 2).toUpperCase()
              : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            return (
              <>
                <span className="admin-avatar">{initials}</span>
                <span>
                  <strong>{adminName}</strong>
                  <small>Quản trị viên</small>
                </span>
              </>
            );
          })()}
          <IconChevronDown size={14} />
        </Link>
      </div>
    </aside>
  );
}

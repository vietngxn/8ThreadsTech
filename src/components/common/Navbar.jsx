
import { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  IconArrowRight,
  IconLogout,
  IconSearch,
  IconShoppingBag,
  IconUser,
  IconX,
} from "@tabler/icons-react";

import { useNavbar } from "../../hooks/useNavbar";
import logo from "../../assets/thread-logo.png";
import NoticeToast from "../product-detail/NoticeToast";
import { authService } from "../../services/authService";
import { categoryService } from "../../services/categoryService";

import { useCart } from "../../hooks/useCart";

export default function Navbar({ quantity, onSearch }) {
  const navRef = useNavbar();
  const searchInputRef = useRef(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [notice, setNotice] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(authService.getToken()));
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const { cartCount } = useCart();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(Boolean(authService.getToken()));
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener("auth:state-change", handleAuthChange);
    return () => window.removeEventListener("auth:state-change", handleAuthChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayQuantity = cartCount;

  // Danh sách danh mục lấy từ Backend
  const [categories, setCategories] = useState(() =>
    categoryService.getCachedParentCategories()
  );

  useEffect(() => {
    categoryService.getParentCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Xác định danh mục đang được chọn theo URL slug
  const isActiveCategory = (slug) => {
    return pathname === `/${slug}` ||
      pathname.startsWith(`/${slug}/`);
  };

  const isProductPage =
    pathname === "/ban-phim" ||
    pathname.startsWith("/ban-phim/") ||
    pathname === "/san-pham" ||
    pathname.startsWith("/san-pham/");

  const isTeamPage = pathname === "/ve-8threads-team";

  const isAccountPage =
    pathname === "/ho-so" ||
    pathname === "/so-dia-chi" ||
    pathname === "/doi-mat-khau" ||
    pathname === "/don-hang" ||
    pathname.startsWith("/don-hang/") ||
    pathname === "/dang-nhap" ||
    pathname === "/dang-ky";

  const isCartPage =
    pathname === "/gio-hang" ||
    pathname === "/thanh-toan" ||
    pathname === "/hoan-tat";

  // Lấy danh mục cha từ Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getParentCategories();
        setCategories(data);
      } catch (error) {
        console.error("Không thể tải danh mục:", error);
        setNotice("Không thể tải danh sách danh mục.");
      }
    };

    fetchCategories();
  }, []);

  // Tìm kiếm sản phẩm
  const submitSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      searchInputRef.current?.focus();
      return;
    }

    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/ban-phim?q=${encodeURIComponent(query)}`);
    }

    setSearchQuery("");
    setSearchOpen(false);
  };

  // Tự động focus ô tìm kiếm
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  return (
    <>
      <header ref={navRef} className="landing-header">
        <a
          className="landing-brand"
          href="/"
          aria-label="8ThreadTech trang chủ"
        >
          <img src={logo} alt="" />
          <span>8ThreadTech</span>
        </a>

        <nav aria-label="Danh mục">
          {categories.map((category) => {
            const isActive = isActiveCategory(category.slug);

            return (
              <Link
                key={category.id}
                className={isActive ? "active" : ""}
                to={`/${category.slug}`}
                aria-current={isActive ? "page" : undefined}
              >
                {category.name.toUpperCase()}
              </Link>
            );
          })}

          <a
            className={isTeamPage ? "active" : ""}
            href="/ve-8threads-team"
            aria-current={isTeamPage ? "page" : undefined}
          >
            VỀ 8THREADS TEAM
          </a>
        </nav>

        <div className="landing-tools">
          <div className={`navbar-search${searchOpen ? " is-open" : ""}`}>
            <form
              className="navbar-search-form"
              role="search"
              aria-hidden={!searchOpen}
              onSubmit={submitSearch}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setSearchOpen(false);
                }
              }}
            >
              <label
                className="navbar-search-label"
                htmlFor="navbar-search-input"
              >
                Tìm kiếm sản phẩm
              </label>

              <input
                ref={searchInputRef}
                id="navbar-search-input"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm sản phẩm..."
                tabIndex={searchOpen ? 0 : -1}
                disabled={!searchOpen}
              />

              {searchQuery && (
                <button
                  type="button"
                  className="navbar-search-clear"
                  aria-label="Xóa nội dung tìm kiếm"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                >
                  <IconX size={15} />
                </button>
              )}

              <button
                type="submit"
                aria-label="Tìm kiếm"
                disabled={!searchOpen}
              >
                <IconArrowRight size={18} />
              </button>
            </form>

            <button
              type="button"
              className="navbar-search-toggle"
              aria-label={searchOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
              aria-expanded={searchOpen}
              aria-controls="navbar-search-input"
              onClick={() => setSearchOpen((open) => !open)}
            >
              {searchOpen ? (
                <IconX size={22} />
              ) : (
                <IconSearch size={22} />
              )}
            </button>
          </div>

          <a
            href="/gio-hang"
            aria-label={`Giỏ hàng: ${displayQuantity} sản phẩm`}
            aria-current={isCartPage ? "page" : undefined}
          >
            <IconShoppingBag size={22} />
            <span>{displayQuantity}</span>
          </a>

          {isLoggedIn ? (
            <div ref={userDropdownRef} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-label="Tài khoản cá nhân"
                aria-expanded={userMenuOpen}
                style={{
                  background: "transparent",
                  border: "none",
                  color: isAccountPage ? "var(--color-primary, #fff)" : "inherit",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                <IconUser size={22} />
              </button>

              {userMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 14px)",
                    right: 0,
                    width: 210,
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: 8,
                    padding: "8px 0",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
                    zIndex: 1000,
                  }}
                >
                  <div style={{ padding: "8px 16px", borderBottom: "1px solid #27272a" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {currentUser?.fullName || currentUser?.name || "Tài khoản"}
                    </div>
                    <div style={{ fontSize: 11, color: "#a1a1aa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {currentUser?.email || ""}
                    </div>
                  </div>
                  <Link
                    to="/ho-so"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      fontSize: 13,
                      color: "#e4e4e7",
                      textDecoration: "none",
                    }}
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    to="/don-hang"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      fontSize: 13,
                      color: "#e4e4e7",
                      textDecoration: "none",
                    }}
                  >
                    Đơn hàng của tôi
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      authService.logout("/dang-nhap");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 16px",
                      fontSize: 13,
                      color: "#ef4444",
                      background: "transparent",
                      border: "none",
                      borderTop: "1px solid #27272a",
                      marginTop: 4,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <IconLogout size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/dang-nhap"
              aria-label="Đăng nhập"
              aria-current={pathname === "/dang-nhap" ? "page" : undefined}
            >
              <IconUser size={22} />
            </Link>
          )}
        </div>
      </header>

      <div className="navbar-spacer" aria-hidden="true" />

      <NoticeToast
        message={notice}
        onClose={() => setNotice("")}
      />
    </>
  );
}

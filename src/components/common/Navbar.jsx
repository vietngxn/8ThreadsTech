import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconArrowRight, IconSearch, IconShoppingBag, IconUser, IconX } from "@tabler/icons-react";
import { useNavbar } from "../../hooks/useNavbar";
import logo from "../../assets/thread-logo.png";
import NoticeToast from "../product-detail/NoticeToast";

export default function Navbar({ quantity = 0, onComingSoon, onSearch }) {
  const navRef = useNavbar();
  const searchInputRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const showComingSoon = (name) => {
    if (onComingSoon) onComingSoon(name);
    else setNotice(`${name} đang được hoàn thiện.`);
  };
  const handleCategoryClick = (event, name) => {
    event.preventDefault();
    if (pathname === "/ban-phim") {
      document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    showComingSoon(name);
  };
  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      searchInputRef.current?.focus();
      return;
    }

    if (onSearch) onSearch(query);
    else navigate(`/ban-phim?q=${encodeURIComponent(query)}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  return (
    <>
      <header ref={navRef} className="landing-header">
        <a className="landing-brand" href="/" aria-label="8ThreadTech trang chủ">
          <img src={logo} alt="" />
          <span>8ThreadTech</span>
        </a>
        <nav aria-label="Danh mục">
          <a className={isProductPage ? "active" : ""} href="/ban-phim" aria-current={isProductPage ? "page" : undefined}>BÀN PHÍM</a>
          <a href="#space" onClick={(event) => handleCategoryClick(event, "Keycap")}>KEYCAP</a>
          <a href="#space" onClick={(event) => handleCategoryClick(event, "Phụ kiện")}>PHỤ KIỆN</a>
          <a className={isTeamPage ? "active" : ""} href="/ve-8threads-team" aria-current={isTeamPage ? "page" : undefined}>VỀ 8THREADS TEAM</a>
        </nav>
        <div className="landing-tools">
          <div className={`navbar-search${searchOpen ? " is-open" : ""}`}>
            <form
              className="navbar-search-form"
              role="search"
              aria-hidden={!searchOpen}
              onSubmit={submitSearch}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
              }}
            >
              <label className="navbar-search-label" htmlFor="navbar-search-input">Tìm kiếm sản phẩm</label>
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
              <button type="submit" aria-label="Tìm kiếm" disabled={!searchOpen}>
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
              {searchOpen ? <IconX size={22} /> : <IconSearch size={22} />}
            </button>
          </div>
          <a href="/gio-hang" aria-label={`Giỏ hàng: ${quantity} sản phẩm`} aria-current={isCartPage ? "page" : undefined}>
            <IconShoppingBag size={22} />
            <span>{quantity}</span>
          </a>
          <a href="/dang-nhap" aria-label="Tài khoản" aria-current={isAccountPage ? "page" : undefined}>
            <IconUser size={22} />
          </a>
        </div>
      </header>
      <div className="navbar-spacer" aria-hidden="true" />
      <NoticeToast message={notice} onClose={() => setNotice("")} />
    </>
  );
}

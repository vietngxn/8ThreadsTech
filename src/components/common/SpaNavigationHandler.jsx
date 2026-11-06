import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Bắt sự kiện click vào các thẻ <a href="/..."> nội bộ
 * và điều hướng mượt mà qua React Router SPA thay vì reload toàn trang.
 */
export default function SpaNavigationHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (event) => {
      // Chỉ xử lý click chuột trái cơ bản
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      const anchor = event.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Bỏ qua liên kết hash trong trang, liên kết ngoài, mailto, tel, target _blank, download
      if (
        href.startsWith("#") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      // Nếu là đường dẫn nội bộ bắt đầu bằng "/"
      if (href.startsWith("/")) {
        event.preventDefault();
        navigate(href);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [navigate]);

  return null;
}


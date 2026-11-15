import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Cuộn lên đầu trang mỗi khi chuyển route.
 * Nếu URL có hash (#...), tự động cuộn đến phần tử tương ứng.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}


import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import HeroSection from "../components/product-detail/HeroSection";
import PurchaseSection from "../components/product-detail/PurchaseSection";
import ReviewsSection from "../components/product-detail/ReviewsSection";
import PageFooter from "../components/product-detail/PageFooter";
import NoticeToast from "../components/product-detail/NoticeToast";
import { getProductById } from "../data/products";
import { productStore } from "../services/productStore";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [color, setColor] = useState(0);
  const [notice, setNotice] = useState("");

  const comingSoon = (name) => setNotice(`${name} đang được hoàn thiện.`);

  // Ưu tiên tìm trong in-memory store (đã fetch từ danh sách), fallback về static data
  const productInfo = productStore.findById(id) || getProductById(id);

  // Reset màu khi chuyển sản phẩm
  useEffect(() => {
    setColor(0);
  }, [id]);

  useEffect(() => {
    if (productInfo?.name) {
      document.title = `${productInfo.name} | 8Threads Keyboard`;
    }
  }, [productInfo]);

  const activeColors = productInfo?.colors || [];

  return (
    <main className="thread-page" data-node-id="3:1120">
      <Navbar onComingSoon={comingSoon} />

      {/* Hero Section với animation GSAP, tên sản phẩm (hero-word & hero-number) và hình ảnh */}
      <HeroSection
        product={productInfo}
        color={color}
        onColorChange={setColor}
        colors={activeColors}
      />

      {/* Khu vực đặt hàng & bộ chọn màu sắc tương tác */}
      <PurchaseSection
        product={productInfo}
        color={color}
        onColorChange={setColor}
        colors={activeColors}
        onComingSoon={comingSoon}
      />

      {/* Đánh giá & nhận xét */}
      <ReviewsSection product={productInfo} onComingSoon={comingSoon} />

      {/* Footer */}
      <PageFooter />

      {/* Toast thông báo */}
      <NoticeToast message={notice} onClose={() => setNotice("")} />
    </main>
  );
}

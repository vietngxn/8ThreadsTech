import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import HeroSection from "../components/product-detail/HeroSection";
import PurchaseSection from "../components/product-detail/PurchaseSection";
import ReviewsSection from "../components/product-detail/ReviewsSection";
import PageFooter from "../components/product-detail/PageFooter";
import NoticeToast from "../components/product-detail/NoticeToast";
import { productService } from "../services/productService";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [color, setColor] = useState(0);
  const [notice, setNotice] = useState("");
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const comingSoon = (name) => setNotice(`${name} đang được hoàn thiện.`);

  useEffect(() => {
    let alive = true;
    setColor(0);
    setProduct(null);
    setNotFound(false);

    productService.getProductBySlug(id).then((detail) => {
      if (!alive) return;
      if (detail) setProduct(detail);
      else setNotFound(true);
    });

    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    if (product?.name) document.title = `${product.name} | 8Threads Keyboard`;
  }, [product]);

  if (!product) {
    return (
      <main className="thread-page">
        <Navbar onComingSoon={comingSoon} />
        <p style={{ padding: "120px 24px", textAlign: "center" }}>
          {notFound ? "Không tìm thấy sản phẩm." : "Đang tải sản phẩm..."}
        </p>
      </main>
    );
  }

  const activeColors = product.colors || [];

  return (
    <main className="thread-page" data-node-id="3:1120">
      <Navbar onComingSoon={comingSoon} />
      <HeroSection product={product} color={color} onColorChange={setColor} colors={activeColors} />
      <PurchaseSection product={product} color={color} onColorChange={setColor} colors={activeColors} onComingSoon={comingSoon} onNotice={setNotice} />
      <ReviewsSection product={product} onComingSoon={comingSoon} />
      <PageFooter />
      <NoticeToast message={notice} onClose={() => setNotice("")} />
    </main>
  );
}
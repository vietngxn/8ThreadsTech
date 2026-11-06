import { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/product-detail/PageHeader";
import HeroSection from "../components/product-detail/HeroSection";
import PurchaseSection from "../components/product-detail/PurchaseSection";
import ReviewsSection from "../components/product-detail/ReviewsSection";
import PageFooter from "../components/product-detail/PageFooter";
import NoticeToast from "../components/product-detail/NoticeToast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [color, setColor] = useState(0);
  const [notice, setNotice] = useState("");
  const comingSoon = (name) => setNotice(`${name} đang được hoàn thiện.`);

  return (
    <main className="thread-page" data-node-id="3:1120">
      <PageHeader onComingSoon={comingSoon} />
      <HeroSection />
      <PurchaseSection
        color={color}
        onColorChange={setColor}
        onComingSoon={comingSoon}
      />
      <ReviewsSection onComingSoon={comingSoon} />
      <PageFooter />
      <NoticeToast message={notice} onClose={() => setNotice("")} />
    </main>
  );
}
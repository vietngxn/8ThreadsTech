import { useState } from "react";
import NoticeToast from "../components/product-detail/NoticeToast";
import Navbar from "../components/common/Navbar";
import HeroSection from "../components/landing/HeroSection";
import StatsSection from "../components/landing/StatsSection";
import DesignSection from "../components/landing/DesignSection";
import FeelSection from "../components/landing/FeelSection";
import ConnectionSection from "../components/landing/ConnectionSection";
import ColorSection from "../components/landing/ColorSection";
import CollectionSection from "../components/landing/CollectionSection";
import SpaceSection from "../components/landing/SpaceSection";
import TeamSection from "../components/landing/TeamSection";
import ServiceSection from "../components/landing/ServiceSection";
import OrderSection from "../components/landing/OrderSection";
import Footer from "../components/landing/Footer";
import { useHoverAnimation } from "../hooks/useHoverAnimation";
import { useScrollTriggerRefresh } from "../hooks/useResponsiveAnimation";

export default function LandingPage() {
  const [notice, setNotice] = useState("");
  const [selectedColor, setSelectedColor] = useState("Bạc ánh trăng");
  
  const comingSoon = (name) => setNotice(`${name} đang được hoàn thiện.`);

  // Thêm hover animations cho toàn bộ page
  const pageRef = useHoverAnimation();
  
  // Refresh ScrollTrigger sau khi load ảnh/font
  useScrollTriggerRefresh();

  return (
    <main ref={pageRef} className="landing" data-node-id="36:5091">
      <Navbar onComingSoon={comingSoon} />
      <HeroSection />
      <StatsSection />
      <DesignSection />
      <FeelSection />
      <ConnectionSection />
      <ColorSection onColorChange={setSelectedColor} />
      <CollectionSection onComingSoon={comingSoon} />
      <SpaceSection onComingSoon={comingSoon} />
      <TeamSection />
      <ServiceSection />
      <OrderSection selectedColor={selectedColor} onComingSoon={comingSoon} />
      <Footer />
      <NoticeToast message={notice} onClose={() => setNotice("")} />
    </main>
  );
}

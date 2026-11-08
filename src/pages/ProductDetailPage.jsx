import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import HeroSection from "../components/product-detail/HeroSection";
import PurchaseSection from "../components/product-detail/PurchaseSection";
import ReviewsSection from "../components/product-detail/ReviewsSection";
import PageFooter from "../components/product-detail/PageFooter";
import NoticeToast from "../components/product-detail/NoticeToast";

// Assets hình ảnh bàn phím cho từng phối màu
import silverKeyboard from "../assets/thread-keyboard.png";
import blackKeyboard from "../assets/landing-65.png";
import redKeyboard from "../assets/landing-60.png";

// Danh sách phối màu kèm hình ảnh và thông tin chi tiết
export const THREAD75_COLORS = [
  {
    name: "Bạc ánh trăng",
    color: "#c8c9ca",
    switchDesc: "Linear Red Switch · Êm & mượt",
    tagline: "GÕ CHẤT. CHƠI KHÁC.",
    image: silverKeyboard,
    glow: "rgba(200, 201, 202, 0.16)",
  },
  {
    name: "Đen nguyên bản",
    color: "#393b3d",
    switchDesc: "Linear Black Switch · Đầm tay & tĩnh lặng",
    tagline: "SẮC ĐEN HUYỀN BÍ. TỐI GIẢN & ĐẦM TAY.",
    image: blackKeyboard,
    glow: "rgba(57, 59, 61, 0.32)",
  },
  {
    name: "Đỏ dung nham",
    color: "#a82125",
    switchDesc: "Rapid Trigger Switch · Nhạy bén & sắc sảo",
    tagline: "RỰC CHÁY ĐAM MÊ. BỨT PHÁ TỐC ĐỘ.",
    image: redKeyboard,
    glow: "rgba(240, 43, 36, 0.25)",
  },
];

// Danh mục sản phẩm hỗ trợ xem chi tiết
const PRODUCT_INFO_MAP = {
  "thread-75": {
    name: "THREAD 75",
    badge: "MỚI RA MẮT",
    price: 2490000,
    oldPrice: "2.790.000 ₫",
    description: "Từng phím gõ, một nhịp cảm hứng. Thiết kế 75% gọn gàng, hoàn thiện cho cả làm việc lẫn cuộc chơi.",
    availability: "Có sẵn · Sẵn sàng giao trong 24h",
  },
  "thread-65": {
    name: "THREAD 65",
    badge: "BÁN CHẠY",
    price: 1890000,
    oldPrice: "2.190.000 ₫",
    description: "Layout 65% siêu gọn gàng, khung nhôm CNC cùng trải nghiệm gõ switch mượt mà.",
    availability: "Có sẵn · Giao trong 24h",
  },
  "thread-98": {
    name: "THREAD 98",
    badge: "TIẾT KIỆM 300K",
    price: 2190000,
    oldPrice: "2.490.000 ₫",
    description: "Layout 98% đầy đủ phím số, tối ưu năng suất làm việc văn phòng và kế toán chuyên nghiệp.",
    availability: "Có sẵn · Giao trong 24h",
  },
  "thread-60-he": {
    name: "THREAD 60 HE",
    badge: "HIỆU NĂNG CAO",
    price: 2790000,
    oldPrice: "3.190.000 ₫",
    description: "Switch từ tính Hall Effect với Rapid Trigger 8.000 Hz, độ phản hồi tức thì cho game thủ chuyên nghiệp.",
    availability: "Có sẵn · Giao trong 24h",
  },
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [color, setColor] = useState(0);
  const [notice, setNotice] = useState("");

  const comingSoon = (name) => setNotice(`${name} đang được hoàn thiện.`);

  // Lấy thông tin sản phẩm dựa vào ID nếu có, mặc định là THREAD 75
  const productInfo = useMemo(() => {
    return PRODUCT_INFO_MAP[id] || PRODUCT_INFO_MAP["thread-75"];
  }, [id]);

  return (
    <main className="thread-page" data-node-id="3:1120">
      <Navbar onComingSoon={comingSoon} />

      {/* Hero Section với animation GSAP và đổi hình ảnh theo màu */}
      <HeroSection
        color={color}
        onColorChange={setColor}
        colors={THREAD75_COLORS}
      />

      {/* Khu vực đặt hàng & bộ chọn màu sắc tương tác */}
      <PurchaseSection
        color={color}
        onColorChange={setColor}
        colors={THREAD75_COLORS}
        product={productInfo}
        onComingSoon={comingSoon}
      />

      {/* Đánh giá & nhận xét với ScrollTrigger animations */}
      <ReviewsSection onComingSoon={comingSoon} />

      {/* Footer */}
      <PageFooter />

      {/* Toast thông báo */}
      <NoticeToast message={notice} onClose={() => setNotice("")} />
    </main>
  );
}

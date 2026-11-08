import { useRef, useEffect } from "react";
import { IconArrowUpRight, IconShoppingBag } from "@tabler/icons-react";
import { gsap, useGSAP } from "../../lib/gsap";

const defaultColors = [
  {
    name: "Bạc ánh trăng",
    color: "#c8c9ca",
    switchDesc: "Linear Red Switch · Êm & mượt",
  },
  {
    name: "Đen nguyên bản",
    color: "#393b3d",
    switchDesc: "Linear Black Switch · Đầm tay & tĩnh lặng",
  },
  {
    name: "Đỏ dung nham",
    color: "#a82125",
    switchDesc: "Rapid Trigger Switch · Nhạy bén & sắc sảo",
  },
];

export default function PurchaseSection({
  color = 0,
  onColorChange = () => {},
  colors = defaultColors,
  onComingSoon = () => {},
  product = null,
}) {
  const sectionRef = useRef(null);
  const colorNameRef = useRef(null);
  const colorDescRef = useRef(null);
  const isFirstMount = useRef(true);

  const activeColors = colors.length > 0 ? colors : defaultColors;
  const currentColor = activeColors[color] || activeColors[0];

  // Scroll reveal animation với ScrollTrigger
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".color-select, .product-info, .purchase-action", {
          autoAlpha: 0,
          y: 45,
          duration: 0.85,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  // Hiệu ứng chuyển động chữ khi chọn màu mới
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (colorNameRef.current && colorDescRef.current) {
      gsap.fromTo(
        [colorNameRef.current, colorDescRef.current],
        { autoAlpha: 0, x: -12 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: "power2.out",
        }
      );
    }
  }, [color]);

  // Click handler với animation nảy của nút swatch
  const handleColorClick = (index, event) => {
    onColorChange(index);

    if (event?.currentTarget) {
      gsap.fromTo(
        event.currentTarget,
        { scale: 0.85 },
        {
          scale: 1.15,
          duration: 0.28,
          ease: "back.out(2)",
          onComplete: () => {
            gsap.to(event.currentTarget, { scale: 1.1, duration: 0.15 });
          },
        }
      );
    }
  };

  return (
    <section ref={sectionRef} className="purchase" data-node-id="3:1165">
      {/* Chọn màu */}
      <div className="color-select">
        <div className="small-label">PHỐI MÀU CỦA BẠN</div>
        <div className="swatches" role="radiogroup" aria-label="Chọn màu sắc bàn phím">
          {activeColors.map((item, index) => (
            <button
              key={item.name}
              type="button"
              className={color === index ? "selected" : ""}
              onClick={(e) => handleColorClick(index, e)}
              aria-label={item.name}
              aria-pressed={color === index}
            >
              <span style={{ background: item.color }} />
            </button>
          ))}
        </div>
        <strong ref={colorNameRef}>{currentColor.name}</strong>
        <p ref={colorDescRef}>{currentColor.switchDesc || "Linear Red Switch · Êm & mượt"}</p>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-info">
        <div className="product-title">
          <h1>{product?.name || "THREAD 75"}</h1>
          <span>{product?.badge || "MỚI RA MẮT"}</span>
        </div>
        <p>
          {product?.description ||
            "Từng phím gõ, một nhịp cảm hứng. Thiết kế 75% gọn gàng, hoàn thiện cho cả làm việc lẫn cuộc chơi."}
        </p>
        <div className="features">
          <span>Nhôm CNC</span>
          <span>Hot-swap</span>
          <span>3 chế độ kết nối</span>
        </div>
      </div>

      {/* Giá & nút mua */}
      <div className="purchase-action">
        <div className="price">
          <strong>
            {product?.price
              ? `${product.price.toLocaleString("vi-VN")} ₫`
              : "2.490.000 ₫"}
          </strong>
          <del>{product?.oldPrice || "2.790.000 ₫"}</del>
        </div>
        <div className="purchase-buttons">
          <a className="buy-button" href="/thanh-toan">
            MUA NGAY <IconArrowUpRight size={18} />
          </a>
          <a className="add-button" href="/gio-hang">
            <IconShoppingBag size={18} /> THÊM VÀO GIỎ
          </a>
        </div>
        <p className="stock">
          <span />
          {product?.availability || "Có sẵn · Sẵn sàng giao trong 24h"}
        </p>
      </div>
    </section>
  );
}

export { defaultColors as colors };

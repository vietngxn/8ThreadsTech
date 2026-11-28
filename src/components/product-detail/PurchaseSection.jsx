import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowUpRight, IconShoppingBag, IconCheck } from "@tabler/icons-react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useCart } from "../../hooks/useCart";
import { authService } from "../../services/authService";

const formatPrice = (value) => `${Number(value || 0).toLocaleString("vi-VN")} ₫`;

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
  onNotice = () => {},
  product = null,
}) {
  const sectionRef = useRef(null);
  const colorNameRef = useRef(null);
  const colorDescRef = useRef(null);
  const isFirstMount = useRef(true);

  const activeColors = colors.length > 0 ? colors : defaultColors;
  const currentColor = activeColors[color] || activeColors[0];
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(null); // "cart" | null
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Biến thể đang chọn (màu/switch). Giá và tồn kho lấy theo biến thể, không theo sản phẩm.
  const variantId = currentColor?.variantId;
  const price = currentColor?.price ?? product?.price;
  const oldPrice = currentColor?.compareAtPrice;
  const inStock = currentColor?.inStock !== false;

  /** Kiểm tra chung trước khi thêm. Trả về false nếu không thêm được. */
  const canAdd = () => {
    if (!authService.getToken()) {
      navigate("/dang-nhap", { state: { from: window.location.pathname } });
      return false;
    }
    if (!variantId) {
      onNotice("Không xác định được phiên bản sản phẩm. Vui lòng tải lại trang.");
      return false;
    }
    if (!inStock) {
      onNotice("Phiên bản này đã hết hàng.");
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (busy || !canAdd()) return;
    setBusy("cart");
    try {
      await addToCart(variantId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      onNotice(`Đã thêm "${product?.name}" (${currentColor?.name}) vào giỏ hàng.`);
    } catch (err) {
      onNotice(err.message || "Không thể thêm vào giỏ hàng.");
    } finally {
      setBusy(null);
    }
  };

  // Mua ngay: KHÔNG thêm vào giỏ. Mang thông tin biến thể sang trang thanh toán,
  // BE tạo đơn trực tiếp từ productVariantId (source_type = BUY_NOW).
  const handleBuyNow = () => {
    if (busy || !canAdd()) return;
    navigate("/thanh-toan", {
      state: {
        buyNow: {
          productVariantId: variantId,
          quantity: 1,
          name: product?.name,
          image: currentColor?.image || product?.image,
          color: currentColor?.name,
          switch: currentColor?.switchDesc,
          price,
          oldPrice: oldPrice > price ? oldPrice : null,
        },
      },
    });
  };

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
        <p ref={colorDescRef}>{currentColor.switchDesc || product?.variant || "Linear Red Switch · Êm & mượt"}</p>
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
          {(product?.features || ["Nhôm CNC", "Hot-swap", "3 chế độ kết nối"]).map((feat, i) => (
            <span key={i}>{feat}</span>
          ))}
        </div>
      </div>

      {/* Giá & nút mua */}
      <div className="purchase-action">
        <div className="price">
          <strong>{price != null ? formatPrice(price) : "—"}</strong>
          {oldPrice > price && <del>{formatPrice(oldPrice)}</del>}
        </div>
        <div className="purchase-buttons">
          <button
            type="button"
            className="buy-button"
            onClick={handleBuyNow}
            disabled={!!busy || !inStock}
            style={{ cursor: busy || !inStock ? "not-allowed" : "pointer", border: "none", opacity: inStock ? 1 : 0.5 }}
          >
            MUA NGAY <IconArrowUpRight size={18} />
          </button>
          <button
            type="button"
            className="add-button"
            onClick={handleAddToCart}
            disabled={!!busy || !inStock}
            style={{ cursor: busy || !inStock ? "not-allowed" : "pointer", border: "none", opacity: inStock ? 1 : 0.5 }}
          >
            {added ? <IconCheck size={18} /> : <IconShoppingBag size={18} />}
            {busy === "cart" ? "ĐANG THÊM..." : added ? "ĐÃ THÊM VÀO GIỎ" : "THÊM VÀO GIỎ"}
          </button>
        </div>
        <p className="stock">
          <span />
          {inStock ? "Có sẵn · Sẵn sàng giao trong 24h" : "Phiên bản này tạm hết hàng"}
        </p>
      </div>
    </section>
  );
}

export { defaultColors as colors };
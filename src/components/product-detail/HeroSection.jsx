import { useRef, useEffect, useState } from "react";
import { gsap, useGSAP } from "../../lib/gsap";

export default function HeroSection({
  product = null,
  color = 0,
  onColorChange = () => { },
  colors = [],
}) {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);
  const isFirstMount = useRef(true);

  const currentColorData = colors[color] || {};

  const [displayedIndex, setDisplayedIndex] = useState(color);
  const displayedColorData = colors[displayedIndex] || currentColorData;

  // Cập nhật lại displayedIndex khi đổi sản phẩm
  useEffect(() => {
    setDisplayedIndex(color);
  }, [product?.id, color]);

  // Timeline & ScrollTrigger animations
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Draw / reveal lines
        tl.from(".hero-lines path", {
          strokeDasharray: 1200,
          strokeDashoffset: 1200,
          opacity: 0,
          duration: 1.4,
          stagger: 0.15,
          ease: "power2.inOut",
        })
          .from(
            ".hero-eyebrow",
            { autoAlpha: 0, y: -24, duration: 0.8 },
            "-=1.1"
          )
          .from(
            ".hero-word",
            { autoAlpha: 0, x: -70, scale: 0.95, duration: 1.1 },
            "-=0.85"
          )
          .from(
            ".hero-number",
            { autoAlpha: 0, x: 70, scale: 0.95, duration: 1.1 },
            "-=0.95"
          )
          .from(
            ".hero-keyboard",
            {
              autoAlpha: 0,
              scale: 0.82,
              rotation: -5,
              y: 50,
              duration: 1.3,
              ease: "back.out(1.3)",
            },
            "-=0.8"
          )
          .from(
            ".hero-keyboard-glow",
            {
              autoAlpha: 0,
              scale: 0.6,
              duration: 1.2,
            },
            "-=1.1"
          )
          .from(
            ".hero-tagline, .hero-stat, .hero-dots, .hero-count",
            {
              autoAlpha: 0,
              y: 25,
              stagger: 0.1,
              duration: 0.7,
            },
            "-=0.6"
          );

        // Parallax scrolling
        gsap.to(".hero-keyboard-wrap", {
          y: -40,
          scale: 0.96,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        gsap.to(".hero-word", {
          x: -50,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });

        gsap.to(".hero-number", {
          x: 50,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });

        // Floating idle animation on keyboard
        gsap.to(".hero-keyboard", {
          y: "+=12px",
          rotation: 0.6,
          duration: 3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });

      return () => media.revert();
    },
    { scope: heroRef }
  );

  // Hiệu ứng GSAP chuyển màu khi chọn màu mới
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (displayedIndex === color) return;

    const img = imageRef.current;
    const glow = glowRef.current;
    const count = heroRef.current?.querySelector(".hero-count");
    const tagline = heroRef.current?.querySelector(".hero-tagline");

    if (!img) {
      setDisplayedIndex(color);
      return;
    }

    const tl = gsap.timeline();

    // Thu nhỏ nhẹ & nghiêng khi biến mất
    tl.to(img, {
      scale: 0.88,
      rotation: -6,
      opacity: 0.25,
      filter: "blur(4px)",
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        // Đổi hình ảnh & dữ liệu tại thời điểm thu nhỏ
        setDisplayedIndex(color);
      },
    })
      // Nảy lò xo bung ra với ảnh mới & hiệu ứng sống động
      .to(img, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.45,
        ease: "back.out(1.6)",
      });

    // Cập nhật hiệu ứng hào quang (glow)
    if (glow) {
      gsap.to(glow, {
        backgroundColor: colors[color]?.glow || "transparent",
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }

    // Hiệu ứng chữ đếm sản phẩm (hero count)
    if (count) {
      gsap.fromTo(
        count,
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }

    // Hiệu ứng slogan (tagline)
    if (tagline) {
      gsap.fromTo(
        tagline,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [color, displayedIndex, colors]);

  // Hiệu ứng tương tác 3D tilt theo con trỏ chuột
  const handleMouseMove = (e) => {
    if (!heroRef.current || !imageRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 -> 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 -> 0.5

    gsap.to(imageRef.current, {
      rotationY: x * 14,
      rotationX: -y * 12,
      x: x * 18,
      duration: 0.5,
      ease: "power1.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      rotationY: 0,
      rotationX: 0,
      x: 0,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const totalColors = colors.length;
  const currentCount = String(color + 1).padStart(2, "0");
  const totalCount = String(totalColors).padStart(2, "0");

  const heroWord = product?.heroWord || "";
  const heroNumber = product?.heroNumber || "";
  const isLongHeroNumber = heroNumber.length > 3;
  const heroImage = displayedColorData.image || product?.image || "";
  const taglineText = displayedColorData.tagline || product?.tagline || "";
  const hasStat = Boolean(product?.statValue || product?.statLabel);

  return (
    <section
      ref={heroRef}
      className="thread-hero"
      id="product"
      data-node-id="3:1147"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hero-eyebrow">
        <span />
        THẾ HỆ MỚI. CẢM HỨNG MỚI.
      </div>

      <svg
        className="hero-lines"
        viewBox="0 0 1440 490"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M-80 425 C 220 470, 270 -35, 610 15 S 895 390, 1120 260 S 1390 45, 1520 -30" />
        <path d="M-80 480 C 220 525, 320 10, 650 65 S 890 430, 1135 300 S 1400 100, 1520 20" />
      </svg>

      {heroWord && <div className="hero-word">{heroWord}</div>}
      {heroNumber && (
        <div
          className="hero-number"
          style={isLongHeroNumber ? { fontSize: "clamp(54px, 8.5vw, 115px)", top: "115px" } : undefined}
        >
          {heroNumber}
        </div>
      )}

      {/* Vùng hiển thị bàn phím với hiệu ứng GSAP */}
      {heroImage && (
        <div className="hero-keyboard-wrap">
          <div
            ref={glowRef}
            className="hero-keyboard-glow"
            style={{
              backgroundColor: displayedColorData.glow || "transparent",
            }}
          />
          <img
            ref={imageRef}
            className="hero-keyboard"
            src={heroImage}
            alt={`Bàn phím cơ ${product?.name || ""}${displayedColorData.name ? ` - ${displayedColorData.name}` : ""}`}
            data-node-id="3:1157"
          />
        </div>
      )}

      {taglineText && <p className="hero-tagline">{taglineText}</p>}

      {hasStat && (
        <div className="hero-stat">
          {product?.statValue && <strong>{product.statValue}</strong>}
          {product?.statLabel && <span>{product.statLabel}</span>}
        </div>
      )}

      {/* Bộ chọn chấm tròn điều hướng màu */}
      {totalColors > 0 && (
        <>
          <div className="hero-dots" aria-label="Bộ chọn màu sắc">
            {colors.map((item, index) => (
              <button
                key={item.name || index}
                type="button"
                className={color === index ? "active" : ""}
                onClick={() => onColorChange(index)}
                title={`Chọn phối màu: ${item.name || `Màu ${index + 1}`}`}
                aria-label={`Chọn phối màu: ${item.name || `Màu ${index + 1}`}`}
              />
            ))}
          </div>

          <span className="hero-count">{currentCount} / {totalCount}</span>
        </>
      )}
    </section>
  );
}

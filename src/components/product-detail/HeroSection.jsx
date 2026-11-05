import keyboardImage from "../../assets/thread-keyboard.png";

export default function HeroSection() {
  return (
    <section className="thread-hero" id="product" data-node-id="3:1147">
      <div className="hero-eyebrow"><span />THẾ HỆ MỚI. CẢM HỨNG MỚI.</div>
      <svg className="hero-lines" viewBox="0 0 1440 490" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-80 425 C 220 470, 270 -35, 610 15 S 895 390, 1120 260 S 1390 45, 1520 -30" />
        <path d="M-80 480 C 220 525, 320 10, 650 65 S 890 430, 1135 300 S 1400 100, 1520 20" />
      </svg>
      <div className="hero-word">Thread</div>
      <div className="hero-number">75</div>
      <img
        className="hero-keyboard"
        src={keyboardImage}
        alt="Bàn phím cơ THREAD 75 màu bạc, đen và đỏ"
        data-node-id="3:1157"
      />
      <p className="hero-tagline">GÕ CHẤT. CHƠI KHÁC.</p>
      <div className="hero-stat">
        <strong>1.000 Hz</strong>
        <span>KHÔNG DÂY. KHÔNG ĐỘ TRỄ.</span>
      </div>
      <div className="hero-dots"><i /><i /><i /></div>
      <span className="hero-count">01 / 03</span>
    </section>
  );
}


import { useReveal } from '../../hooks/useReveal';
import switchImage from '../../assets/landing-switch.png';

function Label({ children }) {
  return (
    <div className="landing-label">
      <span />
      {children}
    </div>
  );
}

export default function FeelSection() {
  const feelRef = useReveal({ y: 60, stagger: 0.12 });

  return (
    <section ref={feelRef} className="landing-section feel-section" data-node-id="36:5174">
      <div>
        <Label>
          <span className="js-reveal">02 / FEEL YOUR RHYTHM</span>
        </Label>
        <h2 className="js-reveal">
          ÊM. MƯỢT.<br />CUỐN TỪNG<br />NHỊP CHẠM.
        </h2>
        <p className="js-reveal">
          Linear Red Switch mang đến cảm giác gõ êm và mượt. Để ý tưởng liền mạch, từ dòng code đầu tiên đến ván game cuối ngày.
        </p>
        <div className="feel-detail js-reveal">
          <strong>HOT-SWAP / ĐỔI SWITCH. ĐỔI CẢM HỨNG.</strong>
          <p>Tự chọn nhịp gõ phù hợp với chất riêng của bạn.</p>
        </div>
      </div>
      <img className="js-reveal" src={switchImage} alt="Minh họa Linear Red Switch" />
    </section>
  );
}

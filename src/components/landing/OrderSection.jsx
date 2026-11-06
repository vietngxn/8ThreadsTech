import { IconArrowUpRight, IconShoppingBag } from '@tabler/icons-react';
import { useReveal } from '../../hooks/useReveal';
import keyboard from '../../assets/thread-keyboard.png';

function Label({ children }) {
  return (
    <div className="landing-label">
      <span />
      {children}
    </div>
  );
}

export default function OrderSection({ selectedColor, onComingSoon }) {
  const orderRef = useReveal({ y: 60, stagger: 0.15 });

  return (
    <section ref={orderRef} className="landing-section order-section" id="order" data-node-id="36:5410">
      <Label>
        <span className="js-reveal">09 / NHỊP GÕ MỚI BẮT ĐẦU TỪ ĐÂY</span>
      </Label>
      <h2 className="js-reveal">ĐẾN LƯỢT BẠN BẬT CHẤT.</h2>
      <div className="order-grid">
        <img className="js-reveal" src={keyboard} alt="Bàn phím THREAD 75" />
        <div>
          <h3 className="js-reveal">THREAD 75</h3>
          <p className="js-reveal">{selectedColor} · Linear Red Switch</p>
          <div className="order-price js-reveal">
            <strong>2.490.000 ₫</strong>
            <del>2.790.000 ₫</del>
          </div>
          <div className="order-buttons js-reveal">
            <button onClick={() => onComingSoon("Mua hàng")}>
              MUA NGAY <IconArrowUpRight size={18} />
            </button>
            <button onClick={() => onComingSoon("Giỏ hàng")}>
              <IconShoppingBag size={18} /> THÊM VÀO GIỎ
            </button>
          </div>
          <small className="js-reveal">
            MIỄN PHÍ VẬN CHUYỂN / BẢO HÀNH 24 THÁNG<br />
            ĐỔI MỚI TRONG 7 NGÀY
          </small>
        </div>
      </div>
    </section>
  );
}

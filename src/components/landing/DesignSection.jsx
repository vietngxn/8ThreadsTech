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

export default function DesignSection() {
  const designRef = useReveal({ y: 80, stagger: 0.15 });

  return (
    <section ref={designRef} className="landing-section design-section" id="design" data-node-id="36:5148">
      <Label>
        <span className="js-reveal">01 / THIẾT KẾ CÓ CHIỀU SÂU</span>
      </Label>
      <h2 className="js-reveal">
        KHÔNG CHỈ ĐẸP.<br />CÒN ĐẬM CHẤT RIÊNG.
      </h2>
      <div className="design-grid">
        <div className="design-image js-reveal">
          <span>[ 01.01 / FINISH ]</span>
          <img src={keyboard} alt="Chi tiết khung nhôm THREAD 75" />
          <small>BỀ MẶT NHÔM CNC / BẠC ÁNH TRĂNG</small>
        </div>
        <div className="design-copy">
          <h3 className="js-reveal">CHẠM VÀO SỰ KHÁC BIỆT.</h3>
          <p className="js-reveal">
            Khung nhôm CNC tạo nên đường nét dứt khoát. Sắc bạc ánh trăng đi cùng những điểm nhấn đỏ — một tổng thể gọn gàng nhưng không hòa lẫn.
          </p>
          <div className="design-facts js-reveal">
            <div>
              <strong>75%</strong>
              <p>Gọn cho góc bàn.<br />Đủ cho cảm hứng.</p>
            </div>
            <div>
              <strong>CNC</strong>
              <p>Đường nét mạnh.<br />Hoàn thiện tinh tế.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

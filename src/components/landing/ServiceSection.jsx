import { IconArrowUpRight, IconTruck, IconShieldCheck, IconRefresh } from '@tabler/icons-react';
import { useReveal } from '../../hooks/useReveal';

const services = [
  [IconTruck, "Miễn phí vận chuyển", "ĐƯA NHỊP GÕ ĐẾN GÓC BÀN BẠN."],
  [IconShieldCheck, "Bảo hành 24 tháng", "AN TÂM ĐỒNG HÀNH DÀI LÂU."],
  [IconRefresh, "Đổi mới trong 7 ngày", "THÊM AN TÂM CHO LỰA CHỌN."]
];

const questions = [
  ["THREAD 75 phù hợp với ai?", "Dành cho người muốn một layout 75% gọn gàng cho cả làm việc lẫn chơi game. Khung nhôm CNC, Linear Red Switch và 3 chế độ kết nối tạo nên một lựa chọn cân bằng."],
  ["Tôi có thể thay switch trên THREAD 75 không?", "Có. Thiết kế hot-swap cho phép bạn thay switch để chọn cảm giác gõ phù hợp với mình."],
  ["Chính sách bảo hành và đổi mới như thế nào?", "Sản phẩm được bảo hành 24 tháng và hỗ trợ đổi mới trong 7 ngày."],
  ["Làm sao để được tư vấn chọn phím?", "Liên hệ với 8ThreadTech qua email để được tư vấn lựa chọn phù hợp với nhu cầu của bạn."],
];

function Label({ children }) {
  return (
    <div className="landing-label">
      <span />
      {children}
    </div>
  );
}

export default function ServiceSection() {
  const serviceRef = useReveal({ y: 50, stagger: 0.12 });

  return (
    <section ref={serviceRef} className="landing-section service-section" data-node-id="36:5370">
      <Label>
        <span className="js-reveal">08 / CHỌN CHẤT RIÊNG. GIỮ SỰ AN TÂM.</span>
      </Label>
      
      <div className="service-grid">
        {services.map(([Icon, title, caption]) => (
          <div className="js-reveal" key={title}>
            <Icon size={27} stroke={1.5} />
            <h3>{title}</h3>
            <small>{caption}</small>
          </div>
        ))}
      </div>

      <div className="faq-grid" id="faq">
        <div>
          <h2 className="js-reveal">
            CÒN ĐIỀU<br />BẠN TÒ MÒ?
          </h2>
          <p className="js-reveal">
            Để 8Threads giúp bạn tìm chiếc bàn phím đúng gu, đúng nhu cầu.
          </p>
          <a className="red-link js-reveal" href="mailto:hello@8threadtech.vn">
            NHẮN TIN TƯ VẤN <IconArrowUpRight size={18} />
          </a>
        </div>
        <div>
          {questions.map(([question, answer], i) => (
            <details className="js-reveal" key={question} open={i === 0 ? true : undefined}>
              <summary>
                {question}
                <span />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

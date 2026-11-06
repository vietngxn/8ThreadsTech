import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';
import logo from '../../assets/thread-logo.png';

export default function Footer() {
  const footerRef = useRef();

  useGSAP(
    () => {
      // Reveal footer sections khi scroll vào
      const sections = footerRef.current.querySelectorAll('.footer-grid > div, .footer-signature, .footer-bottom');
      
      gsap.from(sections, {
        autoAlpha: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: footerRef }
  );

  return (
    <footer ref={footerRef} className="landing-footer" data-node-id="36:5435">
      <div className="footer-grid">
        <div>
          <a className="landing-brand" href="#top">
            <img src={logo} alt="" />
            <span>8ThreadTech</span>
          </a>
          <p>Bàn phím không chỉ để gõ. Đó là chất riêng của bạn trong từng nhịp chạm.</p>
        </div>
        <div>
          <h4>KHÁM PHÁ</h4>
          <a href="#collection">Bàn phím</a>
          <a href="#space">Keycap</a>
          <a href="#space">Phụ kiện</a>
          <a href="#team">Về 8Threads Team</a>
        </div>
        <div>
          <h4>HỖ TRỢ</h4>
          <a href="#order">Hướng dẫn mua hàng</a>
          <a href="#faq">Chính sách bảo hành</a>
          <a href="#faq">Vận chuyển &amp; đổi trả</a>
          <a href="#faq">Câu hỏi thường gặp</a>
        </div>
        <div>
          <h4>KẾT NỐI VỚI CHÚNG TÔI</h4>
          <a className="footer-email" href="mailto:hello@8threadtech.vn">
            hello@8threadtech.vn
          </a>
          <p>Thứ 2 – Thứ 7 · 9:00 – 18:00</p>
          <a className="red-link" href="mailto:hello@8threadtech.vn">
            NHẮN TIN TƯ VẤN ↗
          </a>
        </div>
      </div>
      <div className="footer-signature">
        <strong>FEEL YOUR RHYTHM.</strong>
        <span>8THREADS / NHỊP GÕ CỦA BẠN.</span>
      </div>
      <div className="footer-bottom">
        <span>© 2026 8ThreadTech. Tất cả quyền được bảo lưu.</span>
        <span>Điều khoản sử dụng / Chính sách bảo mật</span>
      </div>
    </footer>
  );
}

import { IconTruck, IconShieldCheck, IconRefresh, IconArrowUpRight } from "@tabler/icons-react";

export default function CartFooter() {
  return (
    <footer className="cart-footer" data-node-id="3:518">
      <div className="cart-service" data-node-id="3:519">
        <span>8THREADS / NHỊP GÕ CỦA BẠN.</span>
        <div>
          <span>
            <IconTruck />Miễn phí vận chuyển
          </span>
          <span>
            <IconShieldCheck />Bảo hành 24 tháng
          </span>
          <span>
            <IconRefresh />Đổi mới trong 7 ngày
          </span>
        </div>
      </div>
      <div className="cart-footer-main" data-node-id="3:534">
        <div className="cart-about">
          <strong>8ThreadTech</strong>
          <p>Bàn phím không chỉ để gõ. Đó là chất riêng của bạn trong từng nhịp chạm.</p>
          <div>
            <a href="#footer">Facebook</a>
            <a href="#footer">Instagram</a>
            <a href="#footer">TikTok</a>
          </div>
        </div>
        <div className="cart-footer-links">
          <h2>KHÁM PHÁ</h2>
          <a href="/">Bàn phím</a>
          <a href="/">Keycap</a>
          <a href="/">Phụ kiện</a>
          <a href="/">Về 8Threads Team</a>
        </div>
        <div className="cart-footer-links">
          <h2>HỖ TRỢ</h2>
          <a href="#footer">Hướng dẫn mua hàng</a>
          <a href="#footer">Chính sách bảo hành</a>
          <a href="#footer">Vận chuyển &amp; đổi trả</a>
          <a href="#footer">Câu hỏi thường gặp</a>
        </div>
        <div className="cart-contact">
          <h2>KẾT NỐI VỚI CHÚNG TÔI</h2>
          <a className="cart-email" href="mailto:hello@8threadtech.vn">
            hello@8threadtech.vn
          </a>
          <p>Thứ 2 – Thứ 7 · 9:00 – 18:00</p>
          <a className="cart-consult" href="mailto:hello@8threadtech.vn">
            NHẮN TIN TƯ VẤN <IconArrowUpRight />
          </a>
        </div>
      </div>
      <div className="cart-copyright" data-node-id="3:562">
        <span>© 2026 8ThreadTech. Tất cả quyền được bảo lưu.</span>
        <span>Điều khoản sử dụng&nbsp; / &nbsp;Chính sách bảo mật</span>
      </div>
    </footer>
  );
}

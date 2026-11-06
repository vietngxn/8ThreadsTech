import { IconArrowUpRight, IconTruck, IconShieldCheck, IconRefresh } from "@tabler/icons-react";

export default function ProductListFooter() {
  return (
    <footer className="pl-footer" id="footer" data-node-id="3:1073">
      <div className="pl-service" data-node-id="3:1074">
        <span>8THREADS / NHỊP GÕ CỦA BẠN.</span>
        <div>
          <span>
            <IconTruck size={17} data-node-id="3:1078" />
            Miễn phí vận chuyển
          </span>
          <span>
            <IconShieldCheck size={17} data-node-id="3:1082" />
            Bảo hành 24 tháng
          </span>
          <span>
            <IconRefresh size={17} data-node-id="3:1086" />
            Đổi mới trong 7 ngày
          </span>
        </div>
      </div>
      <div className="pl-footer-main" data-node-id="3:1089">
        <div className="pl-about" data-node-id="3:1090">
          <strong data-node-id="3:1091">8ThreadTech</strong>
          <p data-node-id="3:1092">
            Bàn phím không chỉ để gõ. Đó là chất riêng của bạn trong từng nhịp chạm.
          </p>
          <div>
            <a href="#footer">Facebook</a>
            <a href="#footer">Instagram</a>
            <a href="#footer">TikTok</a>
          </div>
        </div>
        <div className="pl-footer-links">
          <h2>KHÁM PHÁ</h2>
          <a href="#products">Bàn phím</a>
          <a href="#products">Keycap</a>
          <a href="#products">Phụ kiện</a>
          <a href="#footer">Về 8Threads Team</a>
        </div>
        <div className="pl-footer-links">
          <h2>HỖ TRỢ</h2>
          <a href="#footer">Hướng dẫn mua hàng</a>
          <a href="#footer">Chính sách bảo hành</a>
          <a href="#footer">Vận chuyển &amp; đổi trả</a>
          <a href="#footer">Câu hỏi thường gặp</a>
        </div>
        <div className="pl-contact">
          <h2>KẾT NỐI VỚI CHÚNG TÔI</h2>
          <a className="pl-email" href="mailto:hello@8threadtech.vn">
            hello@8threadtech.vn
          </a>
          <p>Thứ 2 – Thứ 7 · 9:00 – 18:00</p>
          <a className="pl-consult" href="mailto:hello@8threadtech.vn">
            NHẮN TIN TƯ VẤN <IconArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="pl-copyright" data-node-id="3:1117">
        <span>© 2026 8ThreadTech. Tất cả quyền được bảo lưu.</span>
        <span>Điều khoản sử dụng&nbsp; / &nbsp;Chính sách bảo mật</span>
      </div>
    </footer>
  );
}

import { IconArrowUpRight } from "@tabler/icons-react";

export default function TeamContact() {
  return (
    <footer className="team-contact" id="contact" data-node-id="27:914">
      <span className="team-eyebrow">03 / LIÊN HỆ</span>
      <div className="team-contact-top">
        <div>
          <h2>Liên hệ</h2>
          <p>
            Nếu cần liên hệ hoặc muốn biết thêm thông tin, vui lòng gửi lời nhắn cho chúng tôi.<br />
            Chúng tôi sẽ phản hồi khi có thể.
          </p>
        </div>
        <a className="team-contact-arrow" href="mailto:hello@8threadtech.vn" aria-label="Gửi email cho 8Threads">
          <IconArrowUpRight size={52} stroke={1} />
        </a>
      </div>
      <div className="team-signature">
        <a href="/" aria-label="8threads trang chủ">8threads</a>
        <div>
          <span>8THREADS / TRANG GIỚI THIỆU NHÓM</span>
          <span>BẢN GIỚI THIỆU MẪU · 2026</span>
        </div>
      </div>
    </footer>
  );
}
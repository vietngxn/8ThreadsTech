import { IconArrowDown, IconArrowUpRight, IconSearch, IconShoppingBag, IconUser } from "@tabler/icons-react";
import logo from "../assets/team-logo.png";
import infinity from "../assets/team-infinity.svg";
import connections from "../assets/team-connections.svg";
import member01 from "../assets/team-member-01.png";
import member02 from "../assets/team-member-02.png";
import member04 from "../assets/team-member-04.png";
import member05 from "../assets/team-member-05.png";
import member06 from "../assets/team-member-06.png";
import member07 from "../assets/team-member-07.png";
import member08 from "../assets/team-member-08.png";
import "./TeamPage.css";

const members = [
  { name: "Nguyễn Hữu Tiến", detail: "23689901", image: member01, imageAlt: "Nguyễn Hữu Tiến bên bờ biển" },
  { name: "Quách Ngọc Long", detail: "Thành viên 8Threads", image: member02, imageAlt: "Quách Ngọc Long bên hồ" },
  { name: "Nguyễn Tiến Đạt", detail: "Thành viên 8Threads" },
  { name: "Nguyễn Hữu Nhân", detail: "236xxxxx", image: member04, imageAlt: "Nguyễn Hữu Nhân trên phố" },
  { name: "Nguyễn Bá Việt", detail: "23687551", image: member05, imageAlt: "Nguyễn Bá Việt trong thành phố" },
  { name: "Cao Quốc Trung", detail: "23666911", image: member06, imageAlt: "Cao Quốc Trung ngoài trời" },
  { name: "Hoàng Trí Minh Tâm", detail: "Thành viên 8Threads", image: member07, imageAlt: "Hoàng Trí Minh Tâm" },
  { name: "Nguyễn Hoàng Sơn", detail: "Thành viên 8Threads", image: member08, imageAlt: "Nguyễn Hoàng Sơn" },
  { name: "Hồ Vạn Thương", detail: "Thành viên 8Threads" },
];

export default function TeamPage() {
  return (
    <main className="team-page" id="top" data-node-id="27:751">
      <header className="team-header" data-node-id="30:1306">
        <a className="team-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="30:1307">
          <img src={logo} alt="" data-node-id="30:1308" />
          <span data-node-id="30:1309">8ThreadTech</span>
        </a>
        <nav aria-label="Danh mục" data-node-id="30:1310">
          <a href="/">BÀN PHÍM</a>
          <a href="/">KEYCAP</a>
          <a href="/">PHỤ KIỆN</a>
          <a className="active" href="/ve-8threads-team">VỀ 8THREADS TEAM</a>
        </nav>
        <div className="team-tools" data-node-id="30:1315">
          <a href="/" aria-label="Tìm kiếm"><IconSearch size={19} stroke={1.5} /></a>
          <a href="/gio-hang" aria-label="Giỏ hàng"><IconShoppingBag size={19} stroke={1.5} /><span>0</span></a>
          <a href="/dang-nhap" aria-label="Tài khoản"><IconUser size={19} stroke={1.5} /></a>
        </div>
      </header>

      <section className="team-hero" data-node-id="27:752">
        <div className="team-hero-title" data-node-id="27:766">
          <h1 data-node-id="27:767">8THREADS TEAM</h1>
          <div className="team-hero-subtitle" data-node-id="27:768">
            <span data-node-id="27:769">về chúng tôi</span>
            <i aria-hidden="true" data-node-id="27:770">✳</i>
          </div>
        </div>
        <div className="team-intro" data-node-id="27:771">
          <img className="team-infinity" src={infinity} alt="" data-node-id="27:773" />
          <div className="team-intro-copy" data-node-id="27:775">
            <p data-node-id="27:776">8Threads Team bao gồm 9 thành viên.<br />Dưới đây là thông tin chung về đội ngũ chúng tôi.</p>
            <a href="#members" data-node-id="27:777">Xem danh sách thành viên <IconArrowDown size={16} /></a>
          </div>
        </div>
      </section>

      <section className="team-members" id="members" data-node-id="27:781">
        <div className="team-section-heading" data-node-id="27:782">
          <span className="team-eyebrow" data-node-id="27:784">01 / THÀNH VIÊN</span>
          <h2 data-node-id="27:785">Đội ngũ 8Threads</h2>
        </div>
        <div className="team-member-grid">
          {members.map((member, index) => (
            <article className={`team-member team-member-${index + 1}`} key={member.name} data-node-id={["27:790", "27:801", "27:812", "27:824", "27:835", "27:846", "27:858", "27:869", "27:880"][index]}>
              <span className="team-member-number">Thành viên {String(index + 1).padStart(2, "0")}</span>
              {member.image && <img className="team-member-photo" src={member.image} alt={member.imageAlt} data-node-id={["85:6", "85:4", null, "69:5", "69:8", "69:12", "97:2", "102:17", null][index] ?? undefined} />}
              <div className="team-member-name"><h3>{member.name}</h3><span aria-hidden="true">↗</span></div>
              <span className="team-member-detail">{member.detail}</span>
              <p>Giới thiệu ngắn</p>
            </article>
          ))}
        </div>
      </section>

      <section className="team-values" data-node-id="27:894">
        <span className="team-eyebrow">02 / VỀ 8THREADS</span>
        <div className="team-values-intro">
          <h2>8threads là một nhóm sinh viên đến từ khoa Kĩ thuật phần mềm IUH.</h2>
          <img src={connections} alt="Chín sợi chỉ cùng kết nối" data-node-id="27:900" />
        </div>
        <div className="team-values-grid">
          <article><span>01</span><h3>Thông tin chung</h3><p>Tên nhóm, thành viên và các mục cần điền sẽ được cập nhật khi có dữ liệu thật.</p></article>
          <article><span>02</span><h3>Ngành nghề</h3><p>Chưa có thông tin ngành nghề cụ thể cho nhóm.</p></article>
          <article><span>03</span><h3>Thành tích</h3><p>Chưa có thành tích cụ thể để cập nhật.</p></article>
        </div>
      </section>

      <footer className="team-contact" id="contact" data-node-id="27:914">
        <span className="team-eyebrow">03 / LIÊN HỆ</span>
        <div className="team-contact-top">
          <div>
            <h2>Liên hệ</h2>
            <p>Nếu cần liên hệ hoặc muốn biết thêm thông tin, vui lòng gửi lời nhắn cho chúng tôi.<br />Chúng tôi sẽ phản hồi khi có thể.</p>
          </div>
          <a className="team-contact-arrow" href="mailto:hello@8threadtech.vn" aria-label="Gửi email cho 8Threads"><IconArrowUpRight size={52} stroke={1} /></a>
        </div>
        <div className="team-signature">
          <a href="/" aria-label="8threads trang chủ">8threads</a>
          <div><span>8THREADS / TRANG GIỚI THIỆU NHÓM</span><span>BẢN GIỚI THIỆU MẪU · 2026</span></div>
        </div>
      </footer>
    </main>
  );
}

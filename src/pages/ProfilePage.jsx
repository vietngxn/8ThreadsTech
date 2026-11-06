import { useState } from "react";
import {
  IconArrowUpRight,
  IconCalendar,
  IconCheck,
  IconChevronRight,
  IconLock,
  IconLogout,
  IconMapPin,
  IconPackage,
  IconSearch,
  IconShieldCheck,
  IconShoppingBag,
  IconUser,
} from "@tabler/icons-react";
import logo from "../assets/thread-logo.png";
import thread75 from "../assets/list-thread-75.png";
import { CartFooter } from "./CartPage.jsx";
import "./ProfilePage.css";

const initialProfile = {
  name: "Nguyễn Minh An",
  email: "minhan@example.com",
  phone: "0987 654 123",
  birthday: "15 / 08 / 1998",
  gender: "Nam",
  newsletter: true,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(false);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setProfile((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setSaved(false);
  };

  const resetProfile = () => {
    setProfile(initialProfile);
    setSaved(false);
  };

  return (
    <div className="profile-page" data-node-id="8:811">
      <header className="cart-header" data-node-id="8:812">
        <a className="cart-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="8:813">
          <img src={logo} alt="" data-node-id="8:814" />
          <span data-node-id="8:815">8ThreadTech</span>
        </a>
        <nav className="cart-nav" aria-label="Danh mục" data-node-id="8:816">
          <a href="/">BÀN PHÍM</a><a href="/">KEYCAP</a><a href="/">PHỤ KIỆN</a><a href="/">VỀ 8THREADS TEAM</a>
        </nav>
        <div className="cart-tools" data-node-id="8:821">
          <button aria-label="Tìm kiếm"><IconSearch /></button>
          <a className="cart-bag" href="/gio-hang" aria-label="Giỏ hàng"><IconShoppingBag /><span>0</span></a>
          <a href="/ho-so" aria-label="Tài khoản"><IconUser /></a>
        </div>
      </header>

      <main>
        <section className="profile-intro" data-node-id="8:830">
          <div className="cart-breadcrumb" data-node-id="8:831">
            <a href="/">Trang chủ</a><IconChevronRight /><a href="/ho-so">Tài khoản</a><IconChevronRight /><span>Hồ sơ cá nhân</span>
          </div>
          <div className="profile-title-wrap" data-node-id="8:837">
            <div className="profile-title" data-node-id="8:838">
              <div className="profile-signature" data-node-id="8:839"><i data-node-id="8:840" /><span data-node-id="8:841">8THREADS - “FEEL” THEO TỪNG NHỊP GÕ CỦA BẠN.</span></div>
              <h1 data-node-id="8:842">HỒ SƠ</h1>
            </div>
          </div>
          <div className="profile-intro-divider" data-node-id="8:846" />
        </section>

        <section className="profile-content" data-node-id="8:847">
          <aside className="profile-sidebar" data-node-id="8:848">
            <div className="profile-identity" data-node-id="8:849">
              <div className="profile-avatar" data-node-id="8:850"><span data-node-id="8:851">{profile.name.split(" ").map((part) => part[0]).slice(-2).join("").toUpperCase()}</span></div>
              <div className="profile-identity-copy" data-node-id="8:852"><strong data-node-id="8:853">{profile.name}</strong><span data-node-id="8:854">{profile.email}</span></div>
              <small data-node-id="8:855">TÀI KHOẢN NGƯỜI DÙNG</small>
            </div>
            <div className="profile-sidebar-rule" data-node-id="8:856" />
            <nav className="profile-menu" aria-label="Điều hướng tài khoản" data-node-id="8:857">
              <a className="is-active" href="#profile" data-node-id="8:858"><IconUser data-node-id="8:1023" /><span data-node-id="8:860">Hồ sơ cá nhân</span><IconChevronRight /></a>
              <a href="#recent-order" data-node-id="8:862"><IconPackage data-node-id="8:1026" /><span data-node-id="8:864">Đơn hàng của tôi</span></a>
              <a href="/so-dia-chi" data-node-id="8:865"><IconMapPin data-node-id="8:1029" /><span data-node-id="8:867">Sổ địa chỉ</span></a>
              <a href="#profile" data-node-id="8:868"><IconLock data-node-id="8:1032" /><span data-node-id="8:870">Đổi mật khẩu</span></a>
              <a href="/dang-nhap" data-node-id="8:871"><IconLogout data-node-id="8:1035" /><span data-node-id="8:873">Đăng xuất</span></a>
            </nav>
            <div className="profile-sidebar-rule profile-help-rule" data-node-id="8:874" />
            <div className="profile-help" data-node-id="8:875"><p data-node-id="8:876">Cần hỗ trợ về tài khoản của bạn?</p><a href="mailto:hello@8threadtech.vn" data-node-id="8:877"><span data-node-id="8:878">NHẮN TIN CHO 8THREADS</span><IconArrowUpRight data-node-id="8:879" /></a></div>
          </aside>

          <div className="profile-main" data-node-id="8:880">
            <form className="profile-card" id="profile" onSubmit={(event) => { event.preventDefault(); setSaved(true); }} data-node-id="8:881">
              <div className="profile-card-heading" data-node-id="8:882">
                <div><h2 data-node-id="8:884">THÔNG TIN CÁ NHÂN</h2><p data-node-id="8:885">Cập nhật thông tin để 8ThreadTech phục vụ bạn tốt hơn.</p></div>
                <span className="required-note" data-node-id="8:887">* Thông tin bắt buộc</span>
              </div>
              <div className="profile-rule" data-node-id="8:888" />
              <div className="profile-fields" data-node-id="8:889">
                <label className="profile-field" data-node-id="8:891"><span data-node-id="8:892">Họ và tên <b>*</b></span><input name="name" value={profile.name} onChange={update} required autoComplete="name" data-node-id="8:893" /></label>
                <label className="profile-field" data-node-id="8:895"><span data-node-id="8:896">Email <b>*</b></span><input name="email" type="email" value={profile.email} onChange={update} required autoComplete="email" data-node-id="8:897" /></label>
                <label className="profile-field" data-node-id="8:900"><span data-node-id="8:901">Số điện thoại <b>*</b></span><input name="phone" type="tel" value={profile.phone} onChange={update} required autoComplete="tel" data-node-id="8:902" /></label>
                <label className="profile-field" data-node-id="8:904"><span data-node-id="8:905">Ngày sinh</span><span className="profile-input-with-icon" data-node-id="8:906"><input name="birthday" value={profile.birthday} onChange={update} data-node-id="8:907" /><IconCalendar data-node-id="8:1038" /></span></label>
                <fieldset className="profile-gender" data-node-id="8:909"><legend data-node-id="8:910">Giới tính <span>(không bắt buộc)</span></legend><div data-node-id="8:911">
                  {["Nam", "Nữ", "Khác", "Không muốn tiết lộ"].map((gender) => <label key={gender} className={profile.gender === gender ? "selected" : ""}><input type="radio" name="gender" value={gender} checked={profile.gender === gender} onChange={update} /><span>{gender}</span></label>)}
                </div></fieldset>
              </div>
              <div className="profile-rule profile-options-rule" data-node-id="8:925" />
              <label className="profile-newsletter" data-node-id="8:926"><input type="checkbox" name="newsletter" checked={profile.newsletter} onChange={update} data-node-id="8:927" /><span className="profile-checkmark"><IconCheck data-node-id="8:1041" /></span><span className="profile-newsletter-copy" data-node-id="8:929"><strong data-node-id="8:930">Nhận tin về sản phẩm mới và ưu đãi từ 8ThreadTech qua email</strong><small data-node-id="8:931">Bạn có thể thay đổi lựa chọn này bất cứ lúc nào.</small></span></label>
              <div className="profile-actions" data-node-id="8:932">
                <p className="profile-privacy" data-node-id="8:933"><IconShieldCheck data-node-id="8:1044" />Thông tin cá nhân của bạn được bảo mật.</p>
                <div className="profile-action-buttons" data-node-id="8:936">
                  <button type="button" className="profile-cancel" onClick={resetProfile} data-node-id="8:937">Hủy thay đổi</button>
                  <button type="submit" className="profile-save" data-node-id="8:939">LƯU THAY ĐỔI<IconArrowUpRight data-node-id="8:941" /></button>
                </div>
              </div>
              {saved && <p className="profile-saved" role="status">Thông tin hồ sơ đã được cập nhật.</p>}
            </form>

            <div className="profile-supporting" data-node-id="8:942">
              <article className="profile-address" id="default-address" data-node-id="8:943">
                <h2 data-node-id="8:944">ĐỊA CHỈ MẶC ĐỊNH</h2>
                <div className="profile-address-details" data-node-id="8:945"><div className="profile-recipient" data-node-id="8:946"><strong data-node-id="8:947">Nguyễn Minh An</strong><span data-node-id="8:948">Nhà riêng</span></div><p>0987 654 123</p><p>123 Đường Số 8, Phường Thủ Đức, TP. Hồ Chí Minh</p></div>
                <div className="profile-rule" data-node-id="8:952" /><a className="profile-red-link" href="mailto:hello@8threadtech.vn" data-node-id="8:953"><span data-node-id="8:954">QUẢN LÝ ĐỊA CHỈ</span><IconArrowUpRight data-node-id="8:955" /></a>
              </article>
              <article className="profile-order" id="recent-order" data-node-id="8:956">
                <div className="profile-order-heading" data-node-id="8:957"><h2 data-node-id="8:958">ĐƠN HÀNG GẦN NHẤT</h2><a className="profile-red-link" href="/hoan-tat" data-node-id="8:959"><span data-node-id="8:960">XEM TẤT CẢ</span><IconArrowUpRight data-node-id="8:961" /></a></div>
                <div className="profile-order-meta" data-node-id="8:962"><strong data-node-id="8:963">#8TT-261027-0186</strong><time data-node-id="8:964">27/10/2026</time></div>
                <span className="profile-order-status" data-node-id="8:965">Đã tiếp nhận · Chờ xác nhận</span>
                <div className="profile-order-items" data-node-id="8:967"><div data-node-id="8:968"><img src={thread75} alt="Bàn phím THREAD 75" data-node-id="8:969" /></div><p data-node-id="8:970"><strong data-node-id="8:971">THREAD 75, THREAD 65, THREAD 98</strong><span data-node-id="8:972">3 sản phẩm · Chưa thanh toán · COD</span></p></div>
                <div className="profile-order-total" data-node-id="8:974"><strong data-node-id="8:975">6.570.000 ₫</strong><a className="profile-red-link" href="/hoan-tat" data-node-id="8:976"><span data-node-id="8:977">XEM CHI TIẾT</span><IconArrowUpRight data-node-id="8:978" /></a></div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <CartFooter />
    </div>
  );
}

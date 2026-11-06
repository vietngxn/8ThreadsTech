import { useState } from "react";
import {
  IconArrowUpRight,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconSearch,
  IconShoppingBag,
  IconUser,
} from "@tabler/icons-react";
import logo from "../assets/login-logo.png";
import keyboard from "../assets/login-keyboard.png";
import keycap from "../assets/login-keycap.png";
import switchImage from "../assets/login-switch.png";
import orbit from "../assets/login-orbit.svg";
import "./LoginPage.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice("Đăng nhập chưa được kết nối. Vui lòng liên hệ hello@8threadtech.vn để được hỗ trợ.");
  };

  return (
    <div className="login-page" data-node-id="3:565">
      <header className="login-header" data-node-id="3:566">
        <a className="login-header-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="3:567">
          <img src={logo} alt="" data-node-id="3:568" />
          <span data-node-id="3:569">8ThreadTech</span>
        </a>
        <nav className="login-nav" aria-label="Danh mục" data-node-id="3:570">
          <a href="/#products" data-node-id="3:571">BÀN PHÍM</a>
          <a href="/#products" data-node-id="3:572">KEYCAP</a>
          <a href="/#products" data-node-id="3:573">PHỤ KIỆN</a>
          <a href="/#footer" data-node-id="3:574">VỀ 8THREADS TEAM</a>
        </nav>
        <div className="login-header-tools" data-node-id="3:575">
          <a href="/#product-search" aria-label="Tìm kiếm" data-node-id="3:576"><IconSearch size={19} stroke={1.5} /></a>
          <a href="/#products" className="login-header-cart" aria-label="Giỏ hàng: 0 sản phẩm" data-node-id="3:578"><IconShoppingBag size={19} stroke={1.5} /><span data-node-id="3:581">0</span></a>
          <a href="/dang-nhap" aria-label="Tài khoản" aria-current="page" data-node-id="3:582"><IconUser size={19} stroke={1.5} /></a>
        </div>
      </header>

      <main className="login-main" data-node-id="3:584">
        <section className="login-stage" aria-label="Chạm phím, bật chất riêng" data-node-id="3:585">
          <h1 data-node-id="3:592">CHẠM PHÍM<br />BẬT CHẤT RIÊNG</h1>
          <div className="login-art" aria-hidden="true">
            <img className="login-art-orbit" src={orbit} alt="" data-node-id="3:590" />
            <img className="login-art-keyboard" src={keyboard} alt="" data-node-id="3:588" />
            <img className="login-art-keycap" src={keycap} alt="" data-node-id="3:587" />
            <img className="login-art-switch" src={switchImage} alt="" data-node-id="3:586" />
            <span className="login-art-glow" data-node-id="3:591" />
          </div>
        </section>

        <section className="login-card" aria-labelledby="login-heading" data-node-id="3:593">
          <div className="login-card-heading" data-node-id="3:594">
            <h2 id="login-heading" data-node-id="3:595">ĐĂNG NHẬP</h2>
            <p data-node-id="3:596">Chào mừng bạn trở lại. Hãy tiếp tục nhịp gõ của riêng mình.</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit} data-node-id="3:597">
            <div className="login-field" data-node-id="3:598">
              <label htmlFor="login-email" data-node-id="3:599">Email</label>
              <div className="login-input-wrap" data-node-id="3:600">
                <IconMail size={17} aria-hidden="true" data-node-id="3:601" />
                <input id="login-email" name="email" type="email" autoComplete="email" placeholder="Nhập địa chỉ email của bạn" required data-node-id="3:603" />
              </div>
            </div>
            <div className="login-field" data-node-id="3:604">
              <label htmlFor="login-password" data-node-id="3:605">Mật khẩu</label>
              <div className="login-input-wrap" data-node-id="3:606">
                <IconLock size={17} aria-hidden="true" data-node-id="3:607" />
                <input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Nhập mật khẩu" required data-node-id="3:609" />
                <button className="login-password-toggle" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} data-node-id="3:610">
                  {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                </button>
              </div>
            </div>
            <div className="login-options" data-node-id="3:612">
              <label className="login-remember" data-node-id="3:613"><input type="checkbox" defaultChecked data-node-id="3:614" /><span data-node-id="3:617">Ghi nhớ đăng nhập</span></label>
              <a href="mailto:hello@8threadtech.vn?subject=H%E1%BB%97%20tr%E1%BB%A3%20t%C3%A0i%20kho%E1%BA%A3n" data-node-id="3:618">Quên mật khẩu?</a>
            </div>
            <button className="login-submit" type="submit" data-node-id="3:619"><span data-node-id="3:620">ĐĂNG NHẬP</span><IconArrowUpRight size={19} data-node-id="3:621" /></button>
            <p className="login-notice" role="status" aria-live="polite">{notice}</p>
          </form>
          <div className="login-divider" data-node-id="3:623"><span data-node-id="3:625" /><small data-node-id="3:626">hoặc tiếp tục với</small><span data-node-id="3:627" /></div>
          <button className="login-google" type="button" onClick={() => setNotice("Đăng nhập bằng Google chưa được kết nối.")} data-node-id="3:628"><strong data-node-id="3:629">G</strong><span data-node-id="3:630">Google</span></button>
          <p className="login-signup" data-node-id="3:631"><span data-node-id="3:632">Chưa có tài khoản? </span><a href="mailto:hello@8threadtech.vn?subject=T%E1%BA%A1o%20t%C3%A0i%20kho%E1%BA%A3n">Đăng ký ngay <IconArrowUpRight size={13} /></a></p>
        </section>
      </main>
    </div>
  );
}

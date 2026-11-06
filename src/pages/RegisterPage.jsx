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
import "./RegisterPage.css";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notice, setNotice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("passwordConfirmation")) {
      setNotice("Mật khẩu nhập lại chưa khớp.");
      return;
    }

    setNotice("Tính năng tạo tài khoản chưa được kết nối.");
  };

  return (
    <div className="login-page register-page" data-node-id="3:633">
      <header className="login-header" data-node-id="3:634">
        <a className="login-header-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="3:635">
          <img src={logo} alt="" data-node-id="3:636" />
          <span data-node-id="3:637">8ThreadTech</span>
        </a>
        <nav className="login-nav" aria-label="Danh mục" data-node-id="3:638">
          <a href="/#products" data-node-id="3:639">BÀN PHÍM</a>
          <a href="/#products" data-node-id="3:640">KEYCAP</a>
          <a href="/#products" data-node-id="3:641">PHỤ KIỆN</a>
          <a href="/#footer" data-node-id="3:642">VỀ 8THREADS TEAM</a>
        </nav>
        <div className="login-header-tools" data-node-id="3:643">
          <a href="/#product-search" aria-label="Tìm kiếm" data-node-id="3:644"><IconSearch size={19} stroke={1.5} /></a>
          <a href="/#products" className="login-header-cart" aria-label="Giỏ hàng: 0 sản phẩm" data-node-id="3:646"><IconShoppingBag size={19} stroke={1.5} /><span data-node-id="3:649">0</span></a>
          <a href="/dang-nhap" aria-label="Tài khoản" data-node-id="3:650"><IconUser size={19} stroke={1.5} /></a>
        </div>
      </header>

      <main className="login-main register-main" data-node-id="3:652">
        <section className="login-stage" aria-label="Chạm phím, bật chất riêng" data-node-id="3:653">
          <h1 data-node-id="3:660">CHẠM PHÍM<br />BẬT CHẤT RIÊNG</h1>
          <div className="login-art" aria-hidden="true">
            <img className="login-art-orbit" src={orbit} alt="" data-node-id="3:658" />
            <img className="login-art-keyboard" src={keyboard} alt="" data-node-id="3:656" />
            <img className="login-art-keycap" src={keycap} alt="" data-node-id="3:655" />
            <img className="login-art-switch" src={switchImage} alt="" data-node-id="3:654" />
            <span className="login-art-glow" data-node-id="3:659" />
          </div>
        </section>

        <section className="login-card register-card" aria-labelledby="register-heading" data-node-id="3:661">
          <div className="login-card-heading" data-node-id="3:662">
            <h2 id="register-heading" data-node-id="3:663">ĐĂNG KÍ</h2>
            <p data-node-id="3:664">Chào mừng bạn trở lại. Hãy tiếp tục nhịp gõ của riêng mình.</p>
          </div>
          <form className="login-form register-form" onSubmit={handleSubmit} data-node-id="3:665">
            <div className="login-field" data-node-id="3:666">
              <label htmlFor="register-name" data-node-id="3:667">Họ và tên</label>
              <div className="login-input-wrap" data-node-id="3:668">
                <IconUser size={17} aria-hidden="true" data-node-id="3:669" />
                <input id="register-name" name="name" type="text" autoComplete="name" placeholder="Nhập họ và tên" required data-node-id="3:671" />
              </div>
            </div>
            <div className="login-field" data-node-id="3:672">
              <label htmlFor="register-email" data-node-id="3:673">Email</label>
              <div className="login-input-wrap" data-node-id="3:674">
                <IconMail size={17} aria-hidden="true" data-node-id="3:675" />
                <input id="register-email" name="email" type="email" autoComplete="email" placeholder="Nhập địa chỉ email của bạn" required data-node-id="3:677" />
              </div>
            </div>
            <div className="login-field" data-node-id="3:678">
              <label htmlFor="register-password" data-node-id="3:679">Mật khẩu</label>
              <div className="login-input-wrap" data-node-id="3:680">
                <IconLock size={17} aria-hidden="true" data-node-id="3:681" />
                <input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} placeholder="Nhập mật khẩu" required data-node-id="3:683" />
                <button className="login-password-toggle" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} data-node-id="3:684">
                  {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                </button>
              </div>
            </div>
            <div className="login-field" data-node-id="3:686">
              <label htmlFor="register-password-confirmation" data-node-id="3:687">Nhập lại mật khẩu</label>
              <div className="login-input-wrap" data-node-id="3:688">
                <IconLock size={17} aria-hidden="true" data-node-id="3:689" />
                <input id="register-password-confirmation" name="passwordConfirmation" type={showConfirmation ? "text" : "password"} autoComplete="new-password" minLength={8} placeholder="Nhập mật khẩu" required data-node-id="3:691" />
                <button className="login-password-toggle" type="button" onClick={() => setShowConfirmation((shown) => !shown)} aria-label={showConfirmation ? "Ẩn mật khẩu nhập lại" : "Hiện mật khẩu nhập lại"} data-node-id="3:692">
                  {showConfirmation ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                </button>
              </div>
            </div>
            <button className="login-submit" type="submit" data-node-id="3:694"><span data-node-id="3:695">ĐĂNG KÍ</span><IconArrowUpRight size={19} data-node-id="3:696" /></button>
            {notice && <p className="register-notice" role="status" aria-live="polite">{notice}</p>}
          </form>
          <div className="login-divider" data-node-id="3:698"><span data-node-id="3:700" /><small data-node-id="3:701">hoặc tiếp tục với</small><span data-node-id="3:702" /></div>
          <button className="login-google" type="button" onClick={() => setNotice("Đăng ký bằng Google chưa được kết nối.")} data-node-id="3:703"><strong data-node-id="3:704">G</strong><span data-node-id="3:705">Google</span></button>
          <p className="login-signup register-login-link" data-node-id="3:706"><span data-node-id="3:707">Đã có tài khoản? </span><a href="/dang-nhap">Đăng nhập ngay <IconArrowUpRight size={13} /></a></p>
        </section>
      </main>
    </div>
  );
}

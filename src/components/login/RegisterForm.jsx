import { useState } from "react";
import { IconArrowUpRight, IconEye, IconEyeOff, IconLock, IconMail, IconUser } from "@tabler/icons-react";

export default function RegisterForm({ notice, onNotice }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("passwordConfirmation")) {
      onNotice("Mật khẩu nhập lại chưa khớp.");
      return;
    }

    onNotice("Tính năng tạo tài khoản chưa được kết nối.");
  };

  const handleGoogleSignup = () => {
    onNotice("Đăng ký bằng Google chưa được kết nối.");
  };

  return (
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
            <input 
              id="register-name" 
              name="name" 
              type="text" 
              autoComplete="name" 
              placeholder="Nhập họ và tên" 
              required 
              data-node-id="3:671" 
            />
          </div>
        </div>
        
        <div className="login-field" data-node-id="3:672">
          <label htmlFor="register-email" data-node-id="3:673">Email</label>
          <div className="login-input-wrap" data-node-id="3:674">
            <IconMail size={17} aria-hidden="true" data-node-id="3:675" />
            <input 
              id="register-email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              placeholder="Nhập địa chỉ email của bạn" 
              required 
              data-node-id="3:677" 
            />
          </div>
        </div>
        
        <div className="login-field" data-node-id="3:678">
          <label htmlFor="register-password" data-node-id="3:679">Mật khẩu</label>
          <div className="login-input-wrap" data-node-id="3:680">
            <IconLock size={17} aria-hidden="true" data-node-id="3:681" />
            <input 
              id="register-password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              autoComplete="new-password" 
              minLength={8} 
              placeholder="Nhập mật khẩu" 
              required 
              data-node-id="3:683" 
            />
            <button 
              className="login-password-toggle" 
              type="button" 
              onClick={() => setShowPassword((shown) => !shown)} 
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} 
              data-node-id="3:684"
            >
              {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
            </button>
          </div>
        </div>
        
        <div className="login-field" data-node-id="3:686">
          <label htmlFor="register-password-confirmation" data-node-id="3:687">Nhập lại mật khẩu</label>
          <div className="login-input-wrap" data-node-id="3:688">
            <IconLock size={17} aria-hidden="true" data-node-id="3:689" />
            <input 
              id="register-password-confirmation" 
              name="passwordConfirmation" 
              type={showConfirmation ? "text" : "password"} 
              autoComplete="new-password" 
              minLength={8} 
              placeholder="Nhập mật khẩu" 
              required 
              data-node-id="3:691" 
            />
            <button 
              className="login-password-toggle" 
              type="button" 
              onClick={() => setShowConfirmation((shown) => !shown)} 
              aria-label={showConfirmation ? "Ẩn mật khẩu nhập lại" : "Hiện mật khẩu nhập lại"} 
              data-node-id="3:692"
            >
              {showConfirmation ? <IconEyeOff size={17} /> : <IconEye size={17} />}
            </button>
          </div>
        </div>
        
        <button className="login-submit" type="submit" data-node-id="3:694">
          <span data-node-id="3:695">ĐĂNG KÍ</span>
          <IconArrowUpRight size={19} data-node-id="3:696" />
        </button>
        
        {notice && <p className="register-notice" role="status" aria-live="polite">{notice}</p>}
      </form>
      
      <div className="login-divider" data-node-id="3:698">
        <span data-node-id="3:700" />
        <small data-node-id="3:701">hoặc tiếp tục với</small>
        <span data-node-id="3:702" />
      </div>
      
      <button className="login-google" type="button" onClick={handleGoogleSignup} data-node-id="3:703">
        <strong data-node-id="3:704">G</strong>
        <span data-node-id="3:705">Google</span>
      </button>
      
      <p className="login-signup register-login-link" data-node-id="3:706">
        <span data-node-id="3:707">Đã có tài khoản? </span>
        <a href="/dang-nhap">
          Đăng nhập ngay <IconArrowUpRight size={13} />
        </a>
      </p>
    </section>
  );
}

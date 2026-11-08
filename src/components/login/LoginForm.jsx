import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowUpRight, IconEye, IconEyeOff, IconLock, IconMail } from "@tabler/icons-react";
import { authService } from "../../services/authService";

export default function LoginForm({ notice, onNotice }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    setIsLoading(true);
    onNotice("");

    try {
      const response = await authService.login({ email, password });
      onNotice(response?.message || "Đăng nhập thành công!");
      setTimeout(() => {
        // Nếu là role ADMIN có thể qua /admin, hoặc mặc định về trang chủ
        const user = response?.data?.user;
        if (user?.role === "ADMIN" || user?.roleName === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (err) {
      onNotice(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    onNotice("Đăng nhập bằng Google đang phát triển.");
  };

  return (
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
            <input 
              id="login-email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              placeholder="Nhập địa chỉ email của bạn" 
              required 
              data-node-id="3:603" 
            />
          </div>
        </div>
        
        <div className="login-field" data-node-id="3:604">
          <label htmlFor="login-password" data-node-id="3:605">Mật khẩu</label>
          <div className="login-input-wrap" data-node-id="3:606">
            <IconLock size={17} aria-hidden="true" data-node-id="3:607" />
            <input 
              id="login-password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              autoComplete="current-password" 
              placeholder="Nhập mật khẩu" 
              required 
              data-node-id="3:609" 
            />
            <button 
              className="login-password-toggle" 
              type="button" 
              onClick={() => setShowPassword((shown) => !shown)} 
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} 
              data-node-id="3:610"
            >
              {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
            </button>
          </div>
        </div>
        
        <div className="login-options" data-node-id="3:612">
          <label className="login-remember" data-node-id="3:613">
            <input type="checkbox" defaultChecked data-node-id="3:614" />
            <span data-node-id="3:617">Ghi nhớ đăng nhập</span>
          </label>
          <a href="mailto:hello@8threadtech.vn?subject=H%E1%BB%97%20tr%E1%BB%A3%20t%C3%A0i%20kho%E1%BA%A3n" data-node-id="3:618">
            Quên mật khẩu?
          </a>
        </div>
        
        <button className="login-submit" type="submit" disabled={isLoading} data-node-id="3:619">
          <span data-node-id="3:620">{isLoading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}</span>
          <IconArrowUpRight size={19} data-node-id="3:621" />
        </button>
        
        <p className="login-notice" role="status" aria-live="polite">
          {notice}
        </p>
      </form>
      
      <div className="login-divider" data-node-id="3:623">
        <span data-node-id="3:625" />
        <small data-node-id="3:626">hoặc tiếp tục với</small>
        <span data-node-id="3:627" />
      </div>
      
      <button className="login-google" type="button" onClick={handleGoogleLogin} data-node-id="3:628">
        <strong data-node-id="3:629">G</strong>
        <span data-node-id="3:630">Google</span>
      </button>
      
      <p className="login-signup" data-node-id="3:631">
        <span data-node-id="3:632">Chưa có tài khoản? </span>
        <a href="/dang-ky">
          Đăng ký ngay <IconArrowUpRight size={13} />
        </a>
      </p>
    </section>
  );
}

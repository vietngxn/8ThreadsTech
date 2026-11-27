import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowUpRight, IconEye, IconEyeOff, IconLock, IconMail, IconRefresh } from "@tabler/icons-react";
import { authService } from "../../services/authService";

// Cùng quy tắc với BE (PasswordRules): ít nhất 8 ký tự, có chữ hoa, chữ thường, chữ số
const isStrongPassword = (value) =>
  value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);

const EMPTY_OTP = ["", "", "", "", "", ""];

/**
 * UC04 Quên mật khẩu, 3 bước trên cùng một trang:
 * email → nhập OTP → đặt mật khẩu mới.
 * OTP được giữ trong state để gửi lại ở bước 3: BE kiểm tra lần nữa trước khi đổi mật khẩu.
 */
export default function ForgotPasswordForm({ notice, onNotice }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email | otp | password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(EMPTY_OTP);
  const [passwords, setPasswords] = useState({ next: "", confirmation: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (step === "otp") inputRefs.current[0]?.focus();
  }, [step]);

  const otpCode = otp.join("");

  // ---------- Bước 1: gửi email ----------
  const sendCode = async (event) => {
    event?.preventDefault();
    if (loading || countdown > 0) return;

    setLoading(true);
    onNotice("");
    try {
      const res = await authService.forgotPassword(email.trim());
      onNotice(res?.message || "Mã OTP đã được gửi vào email của bạn.");
      setCountdown(60); // BE chặn gửi lại trong 60 giây
      setOtp(EMPTY_OTP);
      setStep("otp");
    } catch (err) {
      onNotice(err.message || "Không gửi được mã. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Bước 2: nhập OTP ----------
  const changeDigit = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const backspace = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const pasteOtp = (event) => {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    setOtp(EMPTY_OTP.map((_, i) => digits[i] || ""));
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    if (otpCode.length < 6) {
      onNotice("Vui lòng nhập đủ 6 chữ số mã OTP.");
      return;
    }

    setLoading(true);
    onNotice("");
    try {
      await authService.verifyResetOtp({ email: email.trim(), otp: otpCode });
      setStep("password");
    } catch (err) {
      onNotice(err.message || "Mã OTP không chính xác hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Bước 3: mật khẩu mới ----------
  const savePassword = async (event) => {
    event.preventDefault();
    if (!isStrongPassword(passwords.next)) {
      onNotice("Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và chữ số.");
      return;
    }
    if (passwords.next !== passwords.confirmation) {
      onNotice("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    onNotice("");
    try {
      await authService.resetPassword({
        email: email.trim(),
        otp: otpCode,
        newPassword: passwords.next,
        confirmPassword: passwords.confirmation,
      });
      onNotice("Đặt lại mật khẩu thành công. Đang chuyển về trang đăng nhập...");
      setTimeout(() => navigate("/dang-nhap"), 1200);
    } catch (err) {
      onNotice(err.message || "Không đặt lại được mật khẩu.");
      // OTP hết hạn trong lúc nhập mật khẩu: quay lại bước nhập mã
      if (/otp/i.test(err.message || "")) setStep("otp");
      setLoading(false);
    }
  };

  const updatePassword = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
  };

  return (
    <section className="login-card otp-card" aria-labelledby="forgot-heading">
      <div className="login-card-heading">
        <h2 id="forgot-heading">QUÊN MẬT KHẨU</h2>
        <p>
          {step === "email" && "Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP để bạn đặt lại mật khẩu."}
          {step === "otp" && (
            <>
              Mã OTP gồm 6 chữ số đã được gửi tới <br />
              <strong className="otp-email-highlight">{email}</strong>
            </>
          )}
          {step === "password" && "Tạo mật khẩu mới cho tài khoản của bạn."}
        </p>
      </div>

      {step === "email" && (
        <form className="login-form" onSubmit={sendCode}>
          <div className="login-field">
            <label htmlFor="forgot-email">Email</label>
            <div className="login-input-wrap">
              <IconMail size={17} aria-hidden="true" />
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="Nhập địa chỉ email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button className="login-submit" type="submit" disabled={loading}>
            <span>{loading ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}</span>
            <IconArrowUpRight size={19} />
          </button>
        </form>
      )}

      {step === "otp" && (
        <form className="login-form otp-form" onSubmit={verifyCode}>
          <div className="otp-inputs-row" onPaste={pasteOtp}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => changeDigit(idx, e.target.value)}
                onKeyDown={(e) => backspace(idx, e)}
                className={`otp-digit-input ${digit ? "filled" : ""}`}
                aria-label={`Số thứ ${idx + 1}`}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <div className="otp-resend-row">
            <span className="otp-resend-label">Chưa nhận được mã?</span>
            {countdown > 0 ? (
              <span className="otp-countdown">Gửi lại sau {countdown}s</span>
            ) : (
              <button type="button" className="otp-resend-btn" onClick={sendCode}>
                <IconRefresh size={14} /> Gửi lại mã
              </button>
            )}
          </div>

          <button className="login-submit otp-submit" type="submit" disabled={loading}>
            <span>{loading ? "ĐANG KIỂM TRA..." : "XÁC NHẬN MÃ"}</span>
            <IconArrowUpRight size={19} />
          </button>
        </form>
      )}

      {step === "password" && (
        <form className="login-form" onSubmit={savePassword}>
          <div className="login-field">
            <label htmlFor="forgot-new">Mật khẩu mới</label>
            <div className="login-input-wrap">
              <IconLock size={17} aria-hidden="true" />
              <input
                id="forgot-new"
                name="next"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Ít nhất 8 ký tự, có chữ hoa, chữ thường và số"
                value={passwords.next}
                onChange={updatePassword}
                required
              />
              <button
                className="login-password-toggle"
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="forgot-confirm">Xác nhận mật khẩu mới</label>
            <div className="login-input-wrap">
              <IconLock size={17} aria-hidden="true" />
              <input
                id="forgot-confirm"
                name="confirmation"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu mới"
                value={passwords.confirmation}
                onChange={updatePassword}
                required
              />
            </div>
          </div>

          <button className="login-submit" type="submit" disabled={loading}>
            <span>{loading ? "ĐANG LƯU..." : "XÁC NHẬN"}</span>
            <IconArrowUpRight size={19} />
          </button>
        </form>
      )}

      {notice && (
        <p className="register-notice" role="status" aria-live="polite">
          {notice}
        </p>
      )}

      <div className="otp-footer-links">
        {step === "email" ? (
          <a href="/dang-nhap" className="otp-back-link">← Quay lại đăng nhập</a>
        ) : (
          <button
            type="button"
            className="otp-back-link"
            style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }}
            onClick={() => {
              setStep("email");
              onNotice("");
            }}
          >
            ← Đổi email khác
          </button>
        )}
      </div>
    </section>
  );
}
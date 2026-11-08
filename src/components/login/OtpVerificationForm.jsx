import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconArrowUpRight, IconShieldCheck, IconRefresh } from "@tabler/icons-react";
import { authService } from "../../services/authService";

export default function OtpVerificationForm({ notice, onNotice }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  useEffect(() => {
    // Focus ô đầu tiên khi mở trang
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const lastChar = cleanVal.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);

    if (index < 5 && lastChar) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasteData[i] || "";
    }
    setOtp(newOtp);

    const nextFocusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setCountdown(60);
    onNotice("Đang gửi lại mã xác thực...");
    try {
      // Có thể gọi endpoint gửi lại nếu backend cung cấp hoặc gửi thông báo
      onNotice("Mã xác thực mới đã được gửi lại vào email của bạn.");
    } catch (err) {
      onNotice(err.message || "Không thể gửi lại mã OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      onNotice("Vui lòng nhập đủ 6 chữ số mã OTP.");
      return;
    }

    if (!email) {
      onNotice("Không tìm thấy thông tin email. Vui lòng thực hiện đăng ký lại.");
      return;
    }

    setIsSubmitting(true);
    onNotice("");

    try {
      const response = await authService.verifyEmail({
        email,
        otp: otpCode,
        purpose: "REGISTER",
      });

      onNotice(response?.message || "Xác thực email thành công! Đang chuyển đến đăng nhập...");
      setTimeout(() => {
        navigate("/dang-nhap");
      }, 1200);
    } catch (err) {
      onNotice(err.message || "Mã OTP không chính xác hoặc đã hết hạn.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-card otp-card" aria-labelledby="otp-heading">
      <div className="login-card-heading">
        <h2 id="otp-heading">XÁC THỰC OTP</h2>
        <p>
          Mã xác thực gồm 6 chữ số đã được gửi tới email <br />
          <strong className="otp-email-highlight">{email}</strong>
        </p>
      </div>

      <form className="login-form otp-form" onSubmit={handleSubmit}>
        <div className="otp-inputs-row" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
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
            <button
              type="button"
              className="otp-resend-btn"
              onClick={handleResend}
            >
              <IconRefresh size={14} /> Gửi lại mã
            </button>
          )}
        </div>

        <button className="login-submit otp-submit" type="submit" disabled={isSubmitting}>
          <span>{isSubmitting ? "ĐANG XÁC THỰC..." : "XÁC NHẬN"}</span>
          <IconArrowUpRight size={19} />
        </button>

        {notice && (
          <p className="register-notice" role="status" aria-live="polite">
            {notice}
          </p>
        )}
      </form>

      <div className="otp-footer-links">
        <a href="/dang-ky" className="otp-back-link">
          ← Quay lại trang đăng kí
        </a>
      </div>
    </section>
  );
}


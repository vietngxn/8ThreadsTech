import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import CartFooter from "../components/cart/CartFooter";
import { IconChevronRight } from "@tabler/icons-react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import { authService } from "../services/authService";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ current: "", next: "", confirmation: "" });
  const [visible, setVisible] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [loading, setLoading] = useState(false);
  const redirectTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const updatePassword = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setStatus("");
  };

  const toggleVisibility = (field) => {
    setVisible((current) => ({ ...current, [field]: !current[field] }));
  };

  const resetForm = () => {
    setPasswords({ current: "", next: "", confirmation: "" });
    setErrors({});
    setStatus("");
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (loading) return;

    const nextErrors = {};
    if (!passwords.current) nextErrors.current = "Vui lòng nhập mật khẩu hiện tại.";
    if (passwords.next.length < 8 || !/[A-Z]/.test(passwords.next) || !/[a-z]/.test(passwords.next) || !/\d/.test(passwords.next)) {
      nextErrors.next = "Mật khẩu mới chưa đáp ứng các yêu cầu bảo mật.";
    } else if (passwords.next === passwords.current) {
      nextErrors.next = "Mật khẩu mới cần khác mật khẩu hiện tại.";
    }
    if (passwords.next !== passwords.confirmation) {
      nextErrors.confirmation = "Mật khẩu xác nhận không khớp.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    if (!authService.getToken()) {
      setStatusType("error");
      setStatus("Vui lòng đăng nhập để đổi mật khẩu.");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const res = await authService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
        confirmPassword: passwords.confirmation,
      });

      // Backend đã thu hồi toàn bộ phiên đăng nhập; dọn localStorage và chuyển về trang đăng nhập
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new Event("auth:state-change"));

      setPasswords({ current: "", next: "", confirmation: "" });
      setStatusType("success");
      setStatus(res?.message || "Đổi mật khẩu thành công, vui lòng đăng nhập lại.");
      redirectTimerRef.current = setTimeout(() => navigate("/dang-nhap"), 1500);
    } catch (err) {
      const message = err?.message || "Không thể đổi mật khẩu. Vui lòng thử lại.";
      if (/mật khẩu hiện tại/i.test(message)) {
        setErrors((current) => ({ ...current, current: message }));
      } else {
        setStatusType("error");
        setStatus(message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="profile-page change-password-page" data-node-id="23:332">
      <Navbar quantity={0} />

      <main>
        <section className="change-password-intro">
          <div className="cart-breadcrumb">
            <a href="/">Trang chủ</a>
            <IconChevronRight aria-hidden="true" />
            <a href="/ho-so">Tài khoản</a>
            <IconChevronRight aria-hidden="true" />
            <span>Đổi mật khẩu</span>
          </div>
          <div className="change-password-title-wrap">
            <div className="change-password-title">
              <div className="change-password-signature">
                <i aria-hidden="true" />
                <span>8THREADS - "FEEL" THEO TỪNG NHỊP GÕ CỦA BẠN.</span>
              </div>
              <h1>ĐỔI MẬT KHẨU</h1>
            </div>
          </div>
          <div className="change-password-intro-divider" />
        </section>

        <section className="profile-content change-password-content">
          <ProfileSidebar currentPage="change-password" />
          <ChangePasswordForm
            passwords={passwords}
            visible={visible}
            errors={errors}
            status={status}
            statusType={statusType}
            loading={loading}
            onUpdate={updatePassword}
            onToggleVisibility={toggleVisibility}
            onReset={resetForm}
            onSubmit={submitForm}
          />
        </section>
      </main>

      <CartFooter />
    </div>
  );
}

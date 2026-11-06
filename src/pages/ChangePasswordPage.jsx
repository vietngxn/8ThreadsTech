import { useState } from "react";
import {
  IconArrowUpRight,
  IconCheck,
  IconChevronRight,
  IconEye,
  IconEyeOff,
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
import { CartFooter } from "./CartPage.jsx";
import "./ChangePasswordPage.css";

const initialPasswords = { current: "", next: "", confirmation: "" };
const passwordFields = [
  { name: "current", label: "Mật khẩu hiện tại", placeholder: "Nhập mật khẩu hiện tại", autoComplete: "current-password", nodeId: "23:384" },
  { name: "next", label: "Mật khẩu mới", placeholder: "Nhập mật khẩu mới", autoComplete: "new-password", nodeId: "23:390" },
  { name: "confirmation", label: "Xác nhận mật khẩu mới", placeholder: "Nhập lại mật khẩu mới", autoComplete: "new-password", nodeId: "23:396" },
];

export default function ChangePasswordPage() {
  const [passwords, setPasswords] = useState(initialPasswords);
  const [visible, setVisible] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const updatePassword = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setStatus("");
  };

  const resetForm = () => {
    setPasswords(initialPasswords);
    setErrors({});
    setStatus("");
  };

  const requirements = [
    { label: "Sử dụng ít nhất 8 ký tự.", valid: passwords.next.length >= 8 },
    { label: "Kết hợp chữ hoa, chữ thường và số.", valid: /[A-Z]/.test(passwords.next) && /[a-z]/.test(passwords.next) && /\d/.test(passwords.next) },
    { label: "Không trùng với mật khẩu hiện tại.", valid: Boolean(passwords.next) && passwords.next !== passwords.current },
  ];

  const submitForm = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!passwords.current) nextErrors.current = "Vui lòng nhập mật khẩu hiện tại.";
    if (passwords.next.length < 8 || !/[A-Z]/.test(passwords.next) || !/[a-z]/.test(passwords.next) || !/\d/.test(passwords.next)) {
      nextErrors.next = "Mật khẩu mới chưa đáp ứng các yêu cầu bảo mật.";
    } else if (passwords.next === passwords.current) {
      nextErrors.next = "Mật khẩu mới cần khác mật khẩu hiện tại.";
    }
    if (!passwords.confirmation) nextErrors.confirmation = "Vui lòng xác nhận mật khẩu mới.";
    else if (passwords.confirmation !== passwords.next) nextErrors.confirmation = "Mật khẩu xác nhận chưa khớp.";

    setErrors(nextErrors);
    setStatus(Object.keys(nextErrors).length ? "" : "Biểu mẫu đã hợp lệ. Chưa kết nối dịch vụ cập nhật mật khẩu.");
  };

  return (
    <div className="change-password-page" data-node-id="23:303">
      <header className="cart-header" data-node-id="23:305">
        <a className="cart-brand" href="/" aria-label="8ThreadTech trang chủ" data-node-id="23:306">
          <img src={logo} alt="" data-node-id="23:307" />
          <span data-node-id="23:308">8ThreadTech</span>
        </a>
        <nav className="cart-nav" aria-label="Danh mục" data-node-id="23:309">
          <a href="/">BÀN PHÍM</a><a href="/">KEYCAP</a><a href="/">PHỤ KIỆN</a><a href="/">VỀ 8THREADS TEAM</a>
        </nav>
        <div className="cart-tools" data-node-id="25:1296">
          <button type="button" aria-label="Tìm kiếm"><IconSearch data-node-id="25:1297" /></button>
          <a className="cart-bag" href="/gio-hang" aria-label="Giỏ hàng"><IconShoppingBag data-node-id="25:1300" /><span>0</span></a>
          <a href="/ho-so" aria-label="Tài khoản"><IconUser data-node-id="25:1303" /></a>
        </div>
      </header>

      <main>
        <section className="change-password-intro" data-node-id="23:323">
          <div className="cart-breadcrumb" data-node-id="23:324">
            <a href="/">Trang chủ</a><IconChevronRight /><a href="/ho-so">Tài khoản</a><IconChevronRight /><span>Đổi mật khẩu</span>
          </div>
          <div className="change-password-title-wrap" data-node-id="23:330">
            <div className="change-password-title">
              <div className="change-password-signature" data-node-id="23:331"><i data-node-id="23:332" /><span data-node-id="23:333">8THREADS - “FEEL” THEO TỪNG NHỊP GÕ CỦA BẠN.</span></div>
              <h1 data-node-id="23:334">ĐỔI MẬT KHẨU</h1>
            </div>
          </div>
          <div className="change-password-intro-divider" data-node-id="23:335" />
        </section>

        <section className="change-password-content" data-node-id="23:336">
          <aside className="change-password-sidebar" data-node-id="23:337">
            <div className="change-password-identity" data-node-id="23:338">
              <div className="change-password-avatar" data-node-id="23:339"><span data-node-id="23:340">MA</span></div>
              <div className="change-password-identity-copy" data-node-id="23:341"><strong data-node-id="23:342">Nguyễn Minh An</strong><span data-node-id="23:343">minhan@example.com</span></div>
              <small data-node-id="23:344">TÀI KHOẢN NGƯỜI DÙNG</small>
            </div>
            <div className="change-password-sidebar-rule" data-node-id="23:345" />
            <nav className="change-password-menu" aria-label="Điều hướng tài khoản" data-node-id="23:346">
              <a href="/ho-so" data-node-id="23:347"><IconUser data-node-id="23:348" /><span>Hồ sơ cá nhân</span></a>
              <a href="/don-hang" data-node-id="23:351"><IconPackage data-node-id="23:352" /><span>Đơn hàng của tôi</span></a>
              <a href="/so-dia-chi" data-node-id="23:355"><IconMapPin data-node-id="23:356" /><span>Sổ địa chỉ</span></a>
              <a className="is-active" href="/doi-mat-khau" aria-current="page" data-node-id="23:359"><IconLock data-node-id="23:360" /><span>Đổi mật khẩu</span><IconChevronRight /></a>
              <a href="/dang-nhap" data-node-id="23:364"><IconLogout data-node-id="23:365" /><span>Đăng xuất</span></a>
            </nav>
            <div className="change-password-sidebar-rule change-password-help-rule" data-node-id="23:368" />
            <div className="change-password-help" data-node-id="23:369"><p data-node-id="23:370">Cần hỗ trợ về tài khoản của bạn?</p><a href="mailto:hello@8threadtech.vn" data-node-id="23:371"><span data-node-id="23:372">NHẮN TIN CHO 8THREADS</span><IconArrowUpRight data-node-id="23:373" /></a></div>
          </aside>

          <div className="change-password-main" data-node-id="23:374">
            <form className="change-password-card" onSubmit={submitForm} noValidate>
              <div className="change-password-card-heading" data-node-id="23:375">
                <h2 data-node-id="23:377">ĐỔI MẬT KHẨU</h2>
                <span className="change-password-required" data-node-id="23:379">* Thông tin bắt buộc</span>
              </div>
              <div className="change-password-rule" data-node-id="23:381" />
              <div className="change-password-fields-and-guide" data-node-id="23:382">
                <div className="change-password-fields" data-node-id="23:383">
                  {passwordFields.map((field) => {
                    const inputId = `password-${field.name}`;
                    const errorId = `${inputId}-error`;
                    return (
                      <label className="change-password-field" key={field.name} data-node-id={field.nodeId} htmlFor={inputId}>
                        <span>{field.label} <b>*</b></span>
                        <span className="change-password-input-wrap" data-node-id={field.nodeId === "23:384" ? "23:386" : field.nodeId === "23:390" ? "23:392" : "23:398"}>
                          <input
                            id={inputId}
                            name={field.name}
                            type={visible[field.name] ? "text" : "password"}
                            value={passwords[field.name]}
                            onChange={updatePassword}
                            placeholder={field.placeholder}
                            autoComplete={field.autoComplete}
                            aria-invalid={Boolean(errors[field.name])}
                            aria-describedby={errors[field.name] ? errorId : undefined}
                          />
                          <button type="button" className="change-password-toggle" aria-label={visible[field.name] ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setVisible((current) => ({ ...current, [field.name]: !current[field.name] }))}>
                            {visible[field.name] ? <IconEyeOff /> : <IconEye />}
                          </button>
                        </span>
                        {errors[field.name] && <small className="change-password-error" id={errorId} role="alert">{errors[field.name]}</small>}
                      </label>
                    );
                  })}
                </div>
                <aside className="password-security-guide" data-node-id="23:403">
                  <h3 data-node-id="23:404"><IconShieldCheck data-node-id="23:405" />MẬT KHẨU AN TOÀN</h3>
                  <ul data-node-id="23:407">
                    {requirements.map((requirement) => <li className={requirement.valid ? "is-valid" : ""} key={requirement.label}><span>{requirement.valid ? <IconCheck /> : null}</span>{requirement.label}</li>)}
                  </ul>
                  <div className="change-password-rule" data-node-id="23:420" />
                  <p data-node-id="23:421">Không sử dụng thông tin dễ đoán hoặc chia sẻ mật khẩu với người khác.</p>
                </aside>
              </div>
              <div className="change-password-rule change-password-actions-rule" data-node-id="23:422" />
              <div className="change-password-actions" data-node-id="23:423">
                <button type="button" className="change-password-cancel" onClick={resetForm} data-node-id="23:428">Hủy thay đổi</button>
                <button type="submit" className="change-password-submit" data-node-id="23:430">CẬP NHẬT MẬT KHẨU<IconArrowUpRight data-node-id="23:432" /></button>
              </div>
              {status && <p className="change-password-status" role="status">{status}</p>}
            </form>
          </div>
        </section>
      </main>
      <CartFooter />
    </div>
  );
}

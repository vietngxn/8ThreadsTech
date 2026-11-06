import { IconEye, IconEyeOff, IconLock, IconCheck } from "@tabler/icons-react";

const passwordFields = [
  { name: "current", label: "Mật khẩu hiện tại", placeholder: "Nhập mật khẩu hiện tại", autoComplete: "current-password", nodeId: "23:384" },
  { name: "next", label: "Mật khẩu mới", placeholder: "Nhập mật khẩu mới", autoComplete: "new-password", nodeId: "23:390" },
  { name: "confirmation", label: "Xác nhận mật khẩu mới", placeholder: "Nhập lại mật khẩu mới", autoComplete: "new-password", nodeId: "23:396" },
];

export default function ChangePasswordForm({ passwords, visible, errors, status, onUpdate, onToggleVisibility, onReset, onSubmit }) {
  const requirements = [
    { label: "Sử dụng ít nhất 8 ký tự.", valid: passwords.next.length >= 8 },
    { label: "Kết hợp chữ hoa, chữ thường và số.", valid: /[A-Z]/.test(passwords.next) && /[a-z]/.test(passwords.next) && /\d/.test(passwords.next) },
    { label: "Không trùng với mật khẩu hiện tại.", valid: Boolean(passwords.next) && passwords.next !== passwords.current },
  ];

  return (
    <div className="change-password-main">
      <header className="change-password-card-heading" data-node-id="23:337">
        <h2 data-node-id="23:338">Cập nhật mật khẩu</h2>
        <p data-node-id="23:339">
          Đảm bảo tài khoản của bạn luôn được bảo vệ bằng mật khẩu mạnh và duy nhất.
        </p>
      </header>

      <form className="change-password-card" onSubmit={onSubmit} data-node-id="23:340">
        <div className="change-password-fields-and-guide">
          <div className="change-password-fields">
            {passwordFields.map((field) => (
              <div className="change-password-field" key={field.name} data-node-id={field.nodeId}>
                <label htmlFor={`password-${field.name}`}>{field.label}</label>
                <div className="change-password-input-wrap">
                  <IconLock size={17} aria-hidden="true" />
                  <input
                    id={`password-${field.name}`}
                    name={field.name}
                    type={visible[field.name] ? "text" : "password"}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    value={passwords[field.name]}
                    onChange={onUpdate}
                    required
                    aria-invalid={Boolean(errors[field.name])}
                    aria-describedby={errors[field.name] ? `error-${field.name}` : undefined}
                  />
                  <button
                    className="change-password-toggle"
                    type="button"
                    onClick={() => onToggleVisibility(field.name)}
                    aria-label={visible[field.name] ? `Ẩn ${field.label.toLowerCase()}` : `Hiện ${field.label.toLowerCase()}`}
                  >
                    {visible[field.name] ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                  </button>
                </div>
                {errors[field.name] && (
                  <span id={`error-${field.name}`} className="change-password-error" role="alert">
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="password-security-guide" data-node-id="23:402">
            <h3>Yêu cầu mật khẩu</h3>
            <ul>
              {requirements.map((req, index) => (
                <li key={index} className={req.valid ? "is-valid" : ""}>
                  <IconCheck size={14} aria-hidden="true" />
                  {req.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {status && (
          <p className="change-password-status" role="status">
            {status}
          </p>
        )}

        <div className="change-password-actions" data-node-id="23:413">
          <button type="button" className="change-password-reset" onClick={onReset}>
            HỦY THAY ĐỔI
          </button>
          <button type="submit" className="change-password-submit">
            LƯU MẬT KHẨU MỚI <IconCheck aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}

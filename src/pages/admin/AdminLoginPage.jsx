import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconEyeOff, IconLoader2 } from '@tabler/icons-react';
import { authService } from '../../services/authService.js';
import './AdminLoginPage.css';

/**
 * Kiểm tra user có quyền ADMIN không.
 * Hỗ trợ nhiều format backend có thể trả:
 *   - role: "ADMIN" | "ROLE_ADMIN"
 *   - roles: ["ADMIN"] | ["ROLE_ADMIN"]
 *   - authorities: [{authority: "ROLE_ADMIN"}]
 */
function isAdminUser(user) {
  if (!user) return false;
  // Format 1: role string
  if (typeof user.role === 'string') {
    return user.role === 'ADMIN' || user.role === 'ROLE_ADMIN';
  }
  // Format 2: roles array of strings
  if (Array.isArray(user.roles)) {
    return user.roles.some(r => r === 'ADMIN' || r === 'ROLE_ADMIN');
  }
  // Format 3: authorities array of objects
  if (Array.isArray(user.authorities)) {
    return user.authorities.some(a =>
      (typeof a === 'string' && (a === 'ADMIN' || a === 'ROLE_ADMIN')) ||
      (a?.authority && (a.authority === 'ADMIN' || a.authority === 'ROLE_ADMIN'))
    );
  }
  return false;
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Nếu đã đăng nhập là admin → chuyển thẳng vào dashboard
  useEffect(() => {
    const user = authService.getCurrentUser();
    const token = authService.getToken();
    if (token && user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN')) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  function handleChange(e) {
    setError('');
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email.trim() || !form.password) return;
    setLoading(true);
    setError('');
    try {
      const result = await authService.login({ email: form.email.trim(), password: form.password });
      if (!result?.success) {
        setError(result?.message || 'Đăng nhập thất bại.');
        return;
      }
      const user = authService.getCurrentUser();
      // Debug: xem backend trả về gì
      console.log('[AdminLogin] user object từ BE:', JSON.stringify(user, null, 2));
      if (!user || !isAdminUser(user)) {
        await authService.logout();
        setError('Tài khoản không có quyền truy cập trang quản trị.');
        return;
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || 'Sai email hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="al-root">
      <div className="al-card">
        {/* Logo / branding */}
        <div className="al-brand">
          <span className="al-brand-mark">8T</span>
          <div>
            <p className="al-brand-name">8Threads Tech</p>
            <p className="al-brand-sub">Admin Console</p>
          </div>
        </div>

        <h1 className="al-heading">Đăng nhập quản trị</h1>
        <p className="al-desc">Chỉ dành cho nhân viên và quản trị viên 8Threads Tech.</p>

        <form className="al-form" onSubmit={handleSubmit} noValidate>
          <div className="al-field">
            <label className="al-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="al-input"
              placeholder="admin@8threads.vn"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
              disabled={loading}
              required
            />
          </div>

          <div className="al-field">
            <label className="al-label" htmlFor="password">Mật khẩu</label>
            <div className="al-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="al-input al-input-pw"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="al-eye-btn"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="al-error" role="alert">{error}</div>
          )}

          <button
            type="submit"
            className="al-submit"
            disabled={loading || !form.email || !form.password}
          >
            {loading ? (
              <><IconLoader2 size={16} className="al-spinner" /> Đang xác thực…</>
            ) : 'Đăng nhập'}
          </button>
        </form>

        <p className="al-footer-note">
          Quay lại{' '}
          <a href="/" className="al-link">trang cửa hàng</a>
        </p>
      </div>
    </div>
  );
}

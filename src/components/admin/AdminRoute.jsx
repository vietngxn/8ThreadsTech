import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';

/**
 * Kiểm tra user có quyền ADMIN không.
 * Hỗ trợ nhiều format backend có thể trả:
 *   - role: "ADMIN" | "ROLE_ADMIN"
 *   - roles: ["ADMIN"] | ["ROLE_ADMIN"]
 *   - authorities: [{authority: "ROLE_ADMIN"}]
 */
function isAdminUser(user) {
  if (!user) return false;
  if (typeof user.role === 'string') {
    return user.role === 'ADMIN' || user.role === 'ROLE_ADMIN';
  }
  if (Array.isArray(user.roles)) {
    return user.roles.some(r => r === 'ADMIN' || r === 'ROLE_ADMIN');
  }
  if (Array.isArray(user.authorities)) {
    return user.authorities.some(a =>
      (typeof a === 'string' && (a === 'ADMIN' || a === 'ROLE_ADMIN')) ||
      (a?.authority && (a.authority === 'ADMIN' || a.authority === 'ROLE_ADMIN'))
    );
  }
  return false;
}

/**
 * Route guard cho admin.
 * Nếu chưa đăng nhập hoặc không phải ADMIN → redirect về /admin/login.
 */
export default function AdminRoute({ children }) {
  const token = authService.getToken();
  const user = authService.getCurrentUser();

  if (!token || !isAdminUser(user)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

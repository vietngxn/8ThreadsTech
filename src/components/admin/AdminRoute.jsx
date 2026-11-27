import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';

/**
 * Route guard cho admin.
 * Nếu chưa đăng nhập hoặc không phải ADMIN → redirect về /admin/login.
 */
export default function AdminRoute({ children }) {
  const token = authService.getToken();
  const user = authService.getCurrentUser();

  if (!token || !authService.isAdmin(user)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

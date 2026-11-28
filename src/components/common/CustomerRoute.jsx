import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../../services/authService.js";

function isAdminUser(user) {
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  return roles.some((r) => r === "ADMIN" || r === "ROLE_ADMIN");
}

export default function CustomerRoute({ children }) {
  const location = useLocation();

  if (!authService.getToken()) {
    return <Navigate to="/dang-nhap" replace state={{ from: location.pathname }} />;
  }

  if (isAdminUser(authService.getCurrentUser())) {
    return <Navigate to="/admin" replace />;
  }

  return children ?? <Outlet />;
}
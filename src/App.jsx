import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./layouts/Layout.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import SpaNavigationHandler from "./components/common/SpaNavigationHandler.jsx";

// Pages cửa hàng
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import OtpPage from "./pages/OtpPage.jsx";
import ProductListPage from "./pages/ProductList.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderCompletePage from "./pages/OrderCompletePage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AddressBookPage from "./pages/AddressBookPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";

// Pages quản trị Admin
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProductManagement from "./pages/admin/AdminProductManagement.jsx";
import AdminCategoryManagement from "./pages/admin/AdminCategoryManagement.jsx";
import AdminOrderManagement from "./pages/admin/AdminOrderManagement.jsx";
import AdminCustomerManagement from "./pages/admin/AdminCustomerManagement.jsx";

export default function App() {
  return (
    <BrowserRouter>
      {/* Tự động cuộn lên đầu trang & điều hướng SPA mượt mà */}
      <ScrollToTop />
      <SpaNavigationHandler />

      <Routes>
        {/* === NHÓM QUẢN TRỊ ADMIN (Không dùng Storefront Layout) === */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProductManagement />} />
        <Route path="/admin/categories" element={<AdminCategoryManagement />} />
        <Route path="/admin/orders" element={<AdminOrderManagement />} />
        <Route path="/admin/customers" element={<AdminCustomerManagement />} />

        {/* === NHÓM CỬA HÀNG KHÁCH HÀNG (Bọc trong Storefront Layout) === */}
        <Route element={<Layout />}>
          {/* Trang chủ */}
          <Route path="/" element={<LandingPage />} />

          {/* Sản phẩm & Chi tiết */}
          <Route path="/ban-phim" element={<ProductListPage />} />
          <Route path="/san-pham" element={<ProductListPage />} />
          <Route path="/ban-phim/:id" element={<ProductDetailPage />} />
          <Route path="/san-pham/:id" element={<ProductDetailPage />} />

          {/* Mua hàng & Giỏ hàng */}
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/thanh-toan" element={<CheckoutPage />} />
          <Route path="/hoan-tat" element={<OrderCompletePage />} />

          {/* Đơn hàng */}
          <Route path="/don-hang" element={<OrdersPage />} />
          <Route path="/don-hang/chi-tiet" element={<OrderDetailPage />} />
          <Route path="/don-hang/:id" element={<OrderDetailPage />} />

          {/* Tài khoản cá nhân */}
          <Route path="/ho-so" element={<ProfilePage />} />
          <Route path="/so-dia-chi" element={<AddressBookPage />} />
          <Route path="/doi-mat-khau" element={<ChangePasswordPage />} />
          <Route path="/dang-nhap" element={<LoginPage />} />
          <Route path="/dang-ky" element={<RegisterPage />} />
          <Route path="/xac-thuc-otp" element={<OtpPage />} />

          {/* Về chúng tôi */}
          <Route path="/ve-8threads-team" element={<TeamPage />} />

          {/* Fallback điều hướng về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

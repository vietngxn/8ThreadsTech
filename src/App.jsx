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
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TeamPage from "./pages/TeamPage.jsx";

// Pages quản trị Admin
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProductManagement from "./pages/admin/AdminProductManagement.jsx";
import AdminCategoryManagement from "./pages/admin/AdminCategoryManagement.jsx";
import AdminOrderManagement from "./pages/admin/AdminOrderManagement.jsx";
import AdminCustomerManagement from "./pages/admin/AdminCustomerManagement.jsx";
import AdminPromotionManagement from "./pages/admin/AdminPromotionManagement.jsx";
import AdminStatistics from "./pages/admin/AdminStatistics.jsx";
import AdminJournal from "./pages/admin/AdminJournal.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminHelp from "./pages/admin/AdminHelp.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      {/* Tự động cuộn lên đầu trang & điều hướng SPA mượt mà */}
      <ScrollToTop />
      <SpaNavigationHandler />

      <Routes>
        {/* === NHÓM QUẢN TRỊ ADMIN (Không dùng Storefront Layout) === */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProductManagement /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategoryManagement /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrderManagement /></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><AdminCustomerManagement /></AdminRoute>} />
        <Route path="/admin/promotions" element={<AdminRoute><AdminPromotionManagement /></AdminRoute>} />
        <Route path="/admin/statistics" element={<AdminRoute><AdminStatistics /></AdminRoute>} />
        <Route path="/admin/logs" element={<AdminRoute><AdminJournal /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/help" element={<AdminRoute><AdminHelp /></AdminRoute>} />
        <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />

        {/* === NHÓM CỬA HÀNG KHÁCH HÀNG (Bọc trong Storefront Layout) === */}
        <Route element={<Layout />}>
          {/* Trang chủ */}
          <Route path="/" element={<LandingPage />} />

          {/* Sản phẩm & Chi tiết */}
          <Route path="/ban-phim" element={<ProductListPage />} />
          <Route path="/keycap" element={<ProductListPage />} />
          <Route path="/phu-kien" element={<ProductListPage />} />

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
          <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
          <Route path="/xac-thuc-otp" element={<OtpPage />} />
          <Route path="/otp" element={<OtpPage />} />

          {/* Về chúng tôi */}
          <Route path="/ve-8threads-team" element={<TeamPage />} />

          {/* Fallback điều hướng về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

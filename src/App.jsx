import { Layout } from "./layouts/Layout.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProductList from "./pages/ProductList.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import OrderCompletePage from "./pages/OrderCompletePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import AddressBookPage from "./pages/AddressBookPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/admin" || pathname === "/admin/dashboard") return <AdminDashboard />;

  return (
    <Layout>
      {pathname === "/dang-ky" ? <RegisterPage /> : pathname === "/dang-nhap" ? <LoginPage /> : pathname === "/gio-hang" ? <CartPage /> : pathname === "/thanh-toan" ? <CheckoutPage /> : pathname === "/hoan-tat" ? <OrderCompletePage /> : pathname === "/ho-so" ? <ProfilePage /> : pathname === "/don-hang/chi-tiet" ? <OrderDetailPage /> : pathname === "/don-hang" ? <OrdersPage /> : pathname === "/so-dia-chi" ? <AddressBookPage /> : pathname === "/doi-mat-khau" ? <ChangePasswordPage /> : pathname === "/ve-8threads-team" ? <TeamPage /> : <ProductList />}
    </Layout>
  );
}

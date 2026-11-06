import { Layout } from "./layouts/Layout.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProductList from "./pages/ProductList.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import OrderCompletePage from "./pages/OrderCompletePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";

export default function App() {
  const pathname = window.location.pathname;

  return (
    <Layout>
      {pathname === "/dang-ky" ? <RegisterPage /> : pathname === "/dang-nhap" ? <LoginPage /> : pathname === "/gio-hang" ? <CartPage /> : pathname === "/thanh-toan" ? <CheckoutPage /> : pathname === "/hoan-tat" ? <OrderCompletePage /> : pathname === "/ho-so" ? <ProfilePage /> : pathname === "/don-hang" ? <OrdersPage /> : <ProductList />}
    </Layout>
  );
}
